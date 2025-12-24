import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BillPaymentRequest {
  biller_code: string;
  account_number: string;
  amount: number;
  bill_type: string; // airtime, electricity, water, internet, etc.
  phone_number?: string; // for airtime
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Mock external bill payment providers
const BILL_PROVIDERS = {
  'airtime': {
    'MTN': { name: 'MTN Nigeria', code: 'MTN_NG' },
    'GLO': { name: 'Glo Nigeria', code: 'GLO_NG' },
    'AIRTEL': { name: 'Airtel Nigeria', code: 'AIRTEL_NG' },
    '9MOBILE': { name: '9mobile Nigeria', code: '9MOBILE_NG' }
  },
  'electricity': {
    'EKEDC': { name: 'Eko Electricity', code: 'EKEDC' },
    'IKEDC': { name: 'Ikeja Electric', code: 'IKEDC' },
    'KEDCO': { name: 'Kano Electricity', code: 'KEDCO' }
  },
  'water': {
    'LAGOS_WATER': { name: 'Lagos Water Corporation', code: 'LWC' }
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { biller_code, account_number, amount, bill_type, phone_number }: BillPaymentRequest = await req.json();

    // Validate input
    if (!biller_code || !account_number || !amount || !bill_type || amount <= 0) {
      throw new Error('Invalid bill payment parameters');
    }

    // Validate biller exists
    const billerCategory = BILL_PROVIDERS[bill_type as keyof typeof BILL_PROVIDERS];
    if (!billerCategory || !(biller_code in billerCategory)) {
      throw new Error('Invalid biller code or bill type');
    }

    const biller = billerCategory[biller_code as keyof typeof billerCategory] as { name: string; code: string };
    const amountInCents = BigInt(Math.round(amount * 100));
    const serviceFee = BigInt(10000); // 100 NGN service fee

    // Get user's main wallet
    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .eq('wallet_type', 'main')
      .single();

    if (walletError || !wallet) {
      throw new Error('Wallet not found');
    }

    // Check sufficient balance
    const currentBalance = BigInt(wallet.balance);
    const totalDebit = amountInCents + serviceFee;

    if (currentBalance < totalDebit) {
      throw new Error('Insufficient balance');
    }

    // Create transaction first
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        transaction_type: 'bill_payment',
        amount: amountInCents.toString(),
        transaction_fee: serviceFee.toString(),
        from_wallet_id: wallet.id,
        description: `${bill_type.toUpperCase()} payment to ${biller.name}`,
        status: 'processing',
        currency: wallet.currency,
        metadata: { 
          biller_code, 
          account_number, 
          bill_type,
          phone_number 
        }
      })
      .select()
      .single();

    if (transactionError) {
      throw new Error('Failed to create transaction');
    }

    // Create bill record
    const { data: bill, error: billError } = await supabase
      .from('bills')
      .insert({
        user_id: user.id,
        biller_name: biller.name,
        biller_code: biller_code,
        account_number: account_number,
        amount: amountInCents.toString(),
        transaction_id: transaction.id,
        bill_type: bill_type,
        status: 'processing',
        metadata: { phone_number }
      })
      .select()
      .single();

    if (billError) {
      throw new Error('Failed to create bill record');
    }

    try {
      // Simulate external API call to bill provider
      const paymentResult = await processBillPayment({
        biller_code,
        account_number,
        amount: Number(amountInCents) / 100,
        bill_type,
        phone_number,
        reference: transaction.id
      });

      if (!paymentResult.success) {
        throw new Error(paymentResult.message || 'Bill payment failed');
      }

      // Debit user's wallet
      const newBalance = (currentBalance - totalDebit).toString();
      const { error: debitError } = await supabase
        .from('wallets')
        .update({ balance: newBalance })
        .eq('id', wallet.id);

      if (debitError) throw debitError;

      // Update transaction status
      const { error: updateTransactionError } = await supabase
        .from('transactions')
        .update({ 
          status: 'completed',
          processed_at: new Date().toISOString(),
          external_reference: paymentResult.external_ref
        })
        .eq('id', transaction.id);

      if (updateTransactionError) throw updateTransactionError;

      // Update bill status
      const { error: updateBillError } = await supabase
        .from('bills')
        .update({ 
          status: 'completed',
          paid_at: new Date().toISOString(),
          external_reference: paymentResult.external_ref
        })
        .eq('id', bill.id);

      if (updateBillError) throw updateBillError;

      return new Response(
        JSON.stringify({
          success: true,
          transaction_id: transaction.id,
          bill_id: bill.id,
          amount: amount,
          fee: Number(serviceFee) / 100,
          biller: biller.name,
          account_number: account_number,
          external_reference: paymentResult.external_ref,
          status: 'completed'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (error) {
      // Rollback on failure
      await supabase
        .from('transactions')
        .update({ status: 'failed' })
        .eq('id', transaction.id);

      await supabase
        .from('bills')
        .update({ status: 'failed' })
        .eq('id', bill.id);

      throw new Error('Bill payment failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }

  } catch (error) {
    console.error('Bill payment error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Bill payment failed' }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

// Mock function to simulate external bill payment API
async function processBillPayment(params: any) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulate 95% success rate
  if (Math.random() < 0.95) {
    return {
      success: true,
      external_ref: `EXT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message: 'Payment successful'
    };
  } else {
    return {
      success: false,
      message: 'Service temporarily unavailable'
    };
  }
}