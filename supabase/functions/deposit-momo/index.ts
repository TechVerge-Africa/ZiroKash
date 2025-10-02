import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DepositRequest {
  amount: number;
  phone_number: string;
  provider: 'mtn' | 'vodafone' | 'airteltigo';
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

    const { amount, phone_number, provider, currency = 'GHS' }: DepositRequest = await req.json();

    // Validation
    if (!amount || amount <= 0) {
      throw new Error('Invalid amount');
    }
    if (!phone_number) {
      throw new Error('Phone number required');
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
        payment_method: `momo_${provider}`,
        metadata: { phone_number, provider },
      })
      .select()
      .single();

    if (txError) {
      console.error('Transaction creation error:', txError);
      throw new Error('Failed to create transaction');
    }

    // Integrate with payment provider (Paystack example)
    const paystackKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!paystackKey) {
      throw new Error('Payment provider not configured');
    }

    // Initialize mobile money charge
    const paystackResponse = await fetch('https://api.paystack.co/charge', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        amount: amountInCents,
        currency: currency,
        mobile_money: {
          phone: phone_number,
          provider: provider,
        },
        metadata: {
          transaction_id: transaction.id,
          user_id: user.id,
        },
        callback_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/deposit-webhook`,
      }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackData.status) {
      // Update transaction to failed
      await supabaseClient
        .from('transactions')
        .update({ status: 'failed', metadata: { ...transaction.metadata, error: paystackData.message } })
        .eq('id', transaction.id);

      throw new Error(paystackData.message || 'Payment initialization failed');
    }

    // Update transaction with external reference
    await supabaseClient
      .from('transactions')
      .update({
        external_reference: paystackData.data.reference,
        status: 'processing',
        metadata: { ...transaction.metadata, paystack_data: paystackData.data },
      })
      .eq('id', transaction.id);

    console.log(`MoMo deposit initiated: ${transaction.id} for user ${user.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        transaction_id: transaction.id,
        reference: paystackData.data.reference,
        status: 'processing',
        message: 'Please approve the payment on your phone',
        display_text: paystackData.data.display_text,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Deposit error:', error);
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
