import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WithdrawRequest {
  amount: number;
  bank_code: string;
  account_number: string;
  account_name: string;
  currency?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { amount, bank_code, account_number, account_name, currency = 'GHS' }: WithdrawRequest = await req.json();

    // Validation
    if (!amount || amount <= 0) {
      throw new Error('Invalid amount');
    }
    if (!bank_code || !account_number || !account_name) {
      throw new Error('Bank details required');
    }

    // Get user's main wallet
    const { data: wallet, error: walletError } = await supabaseClient
      .from('wallets')
      .select('id, balance')
      .eq('user_id', user.id)
      .eq('wallet_type', 'main')
      .single();

    if (walletError || !wallet) {
      throw new Error('Wallet not found');
    }

    // Convert amount to cents
    const amountInCents = Math.round(amount * 100);
    const withdrawalFee = Math.round(amountInCents * 0.02); // 2% fee for bank
    const totalDebit = amountInCents + withdrawalFee;

    // Check sufficient balance
    if (wallet.balance < totalDebit) {
      throw new Error('Insufficient balance');
    }

    // Enhanced KYC check for bank withdrawals
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('kyc_status, verification_level')
      .eq('user_id', user.id)
      .single();

    if (profile?.kyc_status !== 'verified' || (profile?.verification_level || 0) < 2) {
      throw new Error('Enhanced KYC verification required for bank withdrawals');
    }

    // Create pending transaction
    const { data: transaction, error: txError } = await supabaseClient
      .from('transactions')
      .insert({
        user_id: user.id,
        from_wallet_id: wallet.id,
        transaction_type: 'withdraw',
        amount: amountInCents,
        transaction_fee: withdrawalFee,
        currency: currency,
        status: 'pending',
        payment_method: 'bank_transfer',
        recipient_address: account_number,
        metadata: { bank_code, account_number, account_name },
      })
      .select()
      .single();

    if (txError) {
      console.error('Transaction creation error:', txError);
      throw new Error('Failed to create transaction');
    }

    // Debit wallet
    const { error: debitError } = await supabaseClient
      .from('wallets')
      .update({ balance: wallet.balance - totalDebit })
      .eq('id', wallet.id);

    if (debitError) {
      console.error('Failed to debit wallet:', debitError);
      throw new Error('Failed to process withdrawal');
    }

    const paystackKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!paystackKey) {
      // Refund
      await supabaseClient.from('wallets').update({ balance: wallet.balance }).eq('id', wallet.id);
      throw new Error('Payment provider not configured');
    }

    // Create transfer recipient
    const recipientResponse = await fetch('https://api.paystack.co/transferrecipient', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'nuban',
        name: account_name,
        account_number: account_number,
        bank_code: bank_code,
        currency: currency,
      }),
    });

    const recipientData = await recipientResponse.json();
    
    if (!recipientData.status) {
      await supabaseClient.from('wallets').update({ balance: wallet.balance }).eq('id', wallet.id);
      await supabaseClient.from('transactions').update({ status: 'failed', metadata: { error: recipientData.message } }).eq('id', transaction.id);
      throw new Error(recipientData.message || 'Recipient creation failed');
    }

    // Initiate transfer
    const transferResponse = await fetch('https://api.paystack.co/transfer', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: 'balance',
        amount: amountInCents,
        recipient: recipientData.data.recipient_code,
        reason: `Bank withdrawal - ${transaction.id}`,
        reference: transaction.id,
      }),
    });

    const transferData = await transferResponse.json();

    if (!transferData.status) {
      await supabaseClient.from('wallets').update({ balance: wallet.balance }).eq('id', wallet.id);
      await supabaseClient.from('transactions').update({ status: 'failed', metadata: { error: transferData.message } }).eq('id', transaction.id);
      throw new Error(transferData.message || 'Transfer failed');
    }

    await supabaseClient
      .from('transactions')
      .update({
        external_reference: transferData.data.transfer_code,
        status: 'processing',
        metadata: {
          ...transaction.metadata,
          recipient_code: recipientData.data.recipient_code,
          transfer_data: transferData.data,
        },
      })
      .eq('id', transaction.id);

    console.log(`Bank withdrawal initiated: ${transaction.id} for user ${user.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        transaction_id: transaction.id,
        reference: transferData.data.transfer_code,
        status: 'processing',
        amount: amountInCents / 100,
        fee: withdrawalFee / 100,
        total: totalDebit / 100,
        message: 'Bank withdrawal is being processed. Funds will arrive in 1-3 business days.',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Bank withdrawal error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
