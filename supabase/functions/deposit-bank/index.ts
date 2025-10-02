import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DepositRequest {
  amount: number;
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

    const { amount, currency = 'GHS' }: DepositRequest = await req.json();

    // Validation
    if (!amount || amount <= 0) {
      throw new Error('Invalid amount');
    }

    // Get user's main wallet
    const { data: wallet, error: walletError } = await supabaseClient
      .from('wallets')
      .select('id')
      .eq('user_id', user.id)
      .eq('wallet_type', 'main')
      .single();

    if (walletError || !wallet) {
      throw new Error('Wallet not found');
    }

    // Convert amount to cents
    const amountInCents = Math.round(amount * 100);

    // Create pending transaction
    const { data: transaction, error: txError } = await supabaseClient
      .from('transactions')
      .insert({
        user_id: user.id,
        to_wallet_id: wallet.id,
        transaction_type: 'deposit',
        amount: amountInCents,
        currency: currency,
        status: 'pending',
        payment_method: 'bank_transfer',
        metadata: { method: 'bank' },
      })
      .select()
      .single();

    if (txError) {
      console.error('Transaction creation error:', txError);
      throw new Error('Failed to create transaction');
    }

    // Initialize payment with Paystack
    const paystackKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!paystackKey) {
      throw new Error('Payment provider not configured');
    }

    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        amount: amountInCents,
        currency: currency,
        reference: transaction.id,
        channels: ['bank', 'bank_transfer'],
        metadata: {
          transaction_id: transaction.id,
          user_id: user.id,
        },
        callback_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/deposit-webhook`,
      }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackData.status) {
      await supabaseClient
        .from('transactions')
        .update({ status: 'failed', metadata: { error: paystackData.message } })
        .eq('id', transaction.id);

      throw new Error(paystackData.message || 'Payment initialization failed');
    }

    // Update transaction with payment details
    await supabaseClient
      .from('transactions')
      .update({
        external_reference: paystackData.data.reference,
        status: 'processing',
        metadata: {
          ...transaction.metadata,
          payment_url: paystackData.data.authorization_url,
          access_code: paystackData.data.access_code,
        },
      })
      .eq('id', transaction.id);

    console.log(`Bank deposit initiated: ${transaction.id} for user ${user.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        transaction_id: transaction.id,
        reference: paystackData.data.reference,
        payment_url: paystackData.data.authorization_url,
        access_code: paystackData.data.access_code,
        status: 'processing',
        message: 'Complete payment via bank transfer',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Bank deposit error:', error);
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
