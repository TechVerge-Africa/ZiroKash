import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MerchantPaymentRequest {
  merchant_id: string;
  amount: number;
  description?: string;
  reference?: string;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

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

    const { merchant_id, amount, description, reference }: MerchantPaymentRequest = await req.json();

    // Validate input
    if (!merchant_id || !amount || amount <= 0) {
      throw new Error('Invalid payment parameters');
    }

    // Get merchant details
    const { data: merchant, error: merchantError } = await supabase
      .from('merchants')
      .select('*')
      .eq('id', merchant_id)
      .eq('is_active', true)
      .single();

    if (merchantError || !merchant) {
      throw new Error('Merchant not found or inactive');
    }

    // Convert amount to cents
    const amountInCents = BigInt(Math.round(amount * 100));
    const merchantFee = BigInt(Math.round(Number(amountInCents) * Number(merchant.commission_rate)));
    const netAmount = amountInCents - merchantFee;

    // Get customer's main wallet
    const { data: customerWallet, error: walletError } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .eq('wallet_type', 'main')
      .single();

    if (walletError || !customerWallet) {
      throw new Error('Customer wallet not found');
    }

    // Check if customer has sufficient balance
    const currentBalance = BigInt(customerWallet.balance);
    if (currentBalance < amountInCents) {
      throw new Error('Insufficient balance');
    }

    // Get merchant's settlement wallet
    const { data: merchantWallet, error: merchantWalletError } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', merchant.user_id)
      .eq('wallet_type', 'main')
      .single();

    if (merchantWalletError || !merchantWallet) {
      throw new Error('Merchant wallet not found');
    }

    // Create transaction
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        transaction_type: 'merchant_payment',
        amount: amountInCents.toString(),
        transaction_fee: merchantFee.toString(),
        from_wallet_id: customerWallet.id,
        to_wallet_id: merchantWallet.id,
        description: description || `Payment to ${merchant.business_name}`,
        external_reference: reference,
        status: 'processing',
        currency: customerWallet.currency,
        metadata: { merchant_id: merchant.id }
      })
      .select()
      .single();

    if (transactionError) {
      throw new Error('Failed to create transaction');
    }

    try {
      // Debit customer wallet
      const newCustomerBalance = (currentBalance - amountInCents).toString();
      const { error: debitError } = await supabase
        .from('wallets')
        .update({ balance: newCustomerBalance })
        .eq('id', customerWallet.id);

      if (debitError) throw debitError;

      // Credit merchant wallet (net amount after fee)
      const merchantBalance = BigInt(merchantWallet.balance);
      const newMerchantBalance = (merchantBalance + netAmount).toString();
      const { error: creditError } = await supabase
        .from('wallets')
        .update({ balance: newMerchantBalance })
        .eq('id', merchantWallet.id);

      if (creditError) throw creditError;

      // Mark transaction as completed
      const { error: updateError } = await supabase
        .from('transactions')
        .update({ 
          status: 'completed',
          processed_at: new Date().toISOString()
        })
        .eq('id', transaction.id);

      if (updateError) throw updateError;

      // Send webhook to merchant if configured
      if (merchant.webhook_url) {
        try {
          await fetch(merchant.webhook_url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-ZiroKash-Signature': 'todo-implement-signature'
            },
            body: JSON.stringify({
              event: 'payment.completed',
              transaction_id: transaction.id,
              amount: amount,
              fee: Number(merchantFee) / 100,
              net_amount: Number(netAmount) / 100,
              reference: reference,
              merchant_id: merchant.id,
              timestamp: new Date().toISOString()
            })
          });
        } catch (webhookError) {
          console.error('Webhook delivery failed:', webhookError);
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          transaction_id: transaction.id,
          amount: amount,
          fee: Number(merchantFee) / 100,
          net_amount: Number(netAmount) / 100,
          status: 'completed',
          merchant: {
            id: merchant.id,
            name: merchant.business_name
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (error) {
      // Rollback transaction on failure
      await supabase
        .from('transactions')
        .update({ status: 'failed' })
        .eq('id', transaction.id);

      throw new Error('Payment failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }

  } catch (error) {
    console.error('Merchant payment error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Merchant payment failed' }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});