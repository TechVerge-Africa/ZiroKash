import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WithdrawRequest {
  amount: number;
  phone_number: string;
  provider: 'mtn' | 'vodafone' | 'airteltigo';
  pin: string;
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

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { amount, phone_number, provider, pin, currency = 'GHS' }: WithdrawRequest = await req.json();

    // Verify PIN before any processing
    const { data: isPinValid, error: pinError } = await supabaseClient.rpc('verify_user_pin', {
      p_pin: pin
    });

    if (pinError || !isPinValid) {
      throw new Error('Invalid security PIN');
    }

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
      .select('id, balance, currency')
      .eq('user_id', user.id)
      .eq('wallet_type', 'main')
      .single();

    if (walletError || !wallet) {
      throw new Error('Wallet not found');
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

    // Create pending transaction (using Admin client to bypass RLS)
    const { data: transaction, error: txError } = await supabaseAdmin
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

    // Debit wallet immediately (using Admin client to bypass RLS)
    const { error: debitError } = await supabaseAdmin
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
      await supabaseAdmin
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
        name: 'ZiroKash User',
        account_number: phone_number,
        bank_code: provider.toUpperCase(),
        currency: currency,
        metadata: {
          user_id: user.id,
          user_email: user.email, // Store actual email in metadata for our use
        },
      }),
    });

    const recipientData = await recipientResponse.json();

    if (!recipientData.status) {
      // Refund wallet
      await supabaseAdmin
        .from('wallets')
        .update({ balance: wallet.balance })
        .eq('id', wallet.id);

      await supabaseAdmin
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
      await supabaseAdmin
        .from('wallets')
        .update({ balance: wallet.balance })
        .eq('id', wallet.id);

      await supabaseAdmin
        .from('transactions')
        .update({ status: 'failed', metadata: { error: transferData.message } })
        .eq('id', transaction.id);

      throw new Error(transferData.message || 'Transfer failed');
    }

    // Update transaction
    await supabaseAdmin
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

    // Get user profile for notification
    const { data: notificationProfile } = await supabaseClient
      .from('profiles')
      .select('full_name')
      .eq('user_id', user.id)
      .single();

    // Get notification preferences
    const { data: notifPrefs } = await supabaseClient
      .from('notification_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Send notification (don't block response)
    if (notifPrefs) {
      supabaseClient.functions.invoke('send-notification', {
        body: {
          type: notifPrefs.email_enabled && notifPrefs.sms_enabled ? 'both' : notifPrefs.email_enabled ? 'email' : 'sms',
          template: 'transaction-success',
          recipient: {
            email: user.email,
            phone: phone_number,
            name: notificationProfile?.full_name || user.email?.split('@')[0] || 'User',
          },
          data: {
            transactionType: 'Withdrawal',
            amount: (amountInCents / 100).toFixed(2),
            currency: wallet.currency,
            reference: transferData.data.transfer_code,
            date: new Date().toLocaleString(),
          },
        },
      }).catch(err => console.error('Notification error:', err));
    }

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
