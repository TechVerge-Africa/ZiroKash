import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WithdrawRequest {
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

    const { amount, phone_number, provider, currency = 'GHS' }: WithdrawRequest = await req.json();

    // Validation
    if (!amount || amount <= 0) {
      throw new Error('Invalid amount');
    }
    if (!phone_number) {
      throw new Error('Phone number required');
    }


    // Convert amount to cents
    const amountInCents = Math.round(amount * 100);
    const withdrawalFee = Math.round(amountInCents * 0.015); // 1.5% fee
    const totalDebit = amountInCents + withdrawalFee;

    // Check sufficient balance
    if (wallet.balance < totalDebit) {
      throw new Error('Insufficient balance');
    }

    // KYC check
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('kyc_status, verification_level')
      .eq('user_id', user.id)
      .single();

    if (profile?.kyc_status !== 'verified') {
      throw new Error('KYC verification required for withdrawals');
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
        payment_method: `momo_${provider}`,
        recipient_address: phone_number,
        metadata: { phone_number, provider },
      })
      .select()
      .single();

    if (txError) {
      console.error('Transaction creation error:', txError);
      throw new Error('Failed to create transaction');
    }

    // Debit wallet immediately (will refund if payout fails)
    const { error: debitError } = await supabaseClient
      .from('wallets')
      .update({ balance: wallet.balance - totalDebit })
      .eq('id', wallet.id);

    if (debitError) {
      console.error('Failed to debit wallet:', debitError);
      throw new Error('Failed to process withdrawal');
    }

    // Integrate with payment provider for payout (Paystack Transfer)
    const paystackKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!paystackKey) {
      // Refund wallet
      await supabaseClient
        .from('wallets')
        .update({ balance: wallet.balance })
        .eq('id', wallet.id);
      throw new Error('Payment provider not configured');
    }

    // Create transfer recipient first
    const recipientResponse = await fetch('https://api.paystack.co/transferrecipient', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'mobile_money',
        name: user.email?.split('@')[0] || 'User',
        account_number: phone_number,
        bank_code: provider.toUpperCase(),
        currency: currency,
      }),
    });

    const recipientData = await recipientResponse.json();
    
    if (!recipientData.status) {
      // Refund wallet
      await supabaseClient
        .from('wallets')
        .update({ balance: wallet.balance })
        .eq('id', wallet.id);

      await supabaseClient
        .from('transactions')
        .update({ status: 'failed', metadata: { error: recipientData.message } })
        .eq('id', transaction.id);

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
        reason: `Withdrawal from ZiroKash - ${transaction.id}`,
        reference: transaction.id,
      }),
    });

    const transferData = await transferResponse.json();

    if (!transferData.status) {
      // Refund wallet
      await supabaseClient
        .from('wallets')
        .update({ balance: wallet.balance })
        .eq('id', wallet.id);

      await supabaseClient
        .from('transactions')
        .update({ status: 'failed', metadata: { error: transferData.message } })
        .eq('id', transaction.id);

      throw new Error(transferData.message || 'Transfer failed');
    }

    // Update transaction
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

    console.log(`MoMo withdrawal initiated: ${transaction.id} for user ${user.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        transaction_id: transaction.id,
        reference: transferData.data.transfer_code,
        status: 'processing',
        amount: amountInCents / 100,
        fee: withdrawalFee / 100,
        total: totalDebit / 100,
        message: 'Withdrawal is being processed. You will receive the funds shortly.',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Withdrawal error:', error);
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
