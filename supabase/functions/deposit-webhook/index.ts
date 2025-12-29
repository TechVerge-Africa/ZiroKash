import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';
import { crypto } from 'https://deno.land/std@0.177.0/crypto/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-paystack-signature',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify webhook signature from Paystack
    const paystackSignature = req.headers.get('x-paystack-signature');
    const body = await req.text();

    console.log('[Deposit Webhook] Received request');

    const secret = Deno.env.get('PAYSTACK_SECRET_KEY') ?? '';
    const encoder = new TextEncoder();
    const data = encoder.encode(body);
    const key = encoder.encode(secret);

    const hmac = await crypto.subtle.importKey(
      'raw',
      key,
      { name: 'HMAC', hash: 'SHA-512' },
      false,
      ['sign']
    );

    const signatureBytes = await crypto.subtle.sign('HMAC', hmac, data);
    const hash = Array.from(new Uint8Array(signatureBytes))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    if (hash !== paystackSignature) {
      console.error('[Deposit Webhook] Invalid signature. Expected:', hash, 'Received:', paystackSignature);
      return new Response('Invalid signature', { status: 401 });
    }

    const payload = JSON.parse(body);
    console.log('[Deposit Webhook] Payload verified. Event:', payload.event);

    if (payload.event === 'charge.success') {
      const reference = payload.data.reference;
      const transactionId = payload.data.metadata?.transaction_id;

      if (!transactionId) {
        console.error('No transaction ID in webhook');
        return new Response('OK', { status: 200 });
      }

      // Get transaction
      const { data: transaction, error: txError } = await supabaseClient
        .from('transactions')
        .select('*, to_wallet_id')
        .eq('id', transactionId)
        .single();

      if (txError || !transaction) {
        console.error('Transaction not found:', transactionId);
        throw new Error('Transaction not found');
      }

      // Get wallet
      const { data: wallet, error: walletError } = await supabaseClient
        .from('wallets')
        .select('balance')
        .eq('id', transaction.to_wallet_id)
        .single();

      if (walletError || !wallet) {
        throw new Error('Wallet not found');
      }

      // Credit wallet
      const newBalance = (wallet.balance || 0) + transaction.amount;
      const { error: updateError } = await supabaseClient
        .from('wallets')
        .update({ balance: newBalance })
        .eq('id', transaction.to_wallet_id);

      if (updateError) {
        console.error('Failed to update wallet:', updateError);
        throw new Error('Failed to credit wallet');
      }

      // Update transaction status
      await supabaseClient
        .from('transactions')
        .update({
          status: 'completed',
          processed_at: new Date().toISOString(),
          metadata: { ...transaction.metadata, webhook_payload: payload.data },
        })
        .eq('id', transactionId);

      console.log(`Deposit completed: ${transactionId}, credited ${transaction.amount} cents`);

      // Send success notification
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('full_name')
        .eq('user_id', transaction.user_id)
        .single();

      const { data: user } = await supabaseClient.auth.admin.getUserById(transaction.user_id);

      const { data: notifPrefs } = await supabaseClient
        .from('notification_preferences')
        .select('*')
        .eq('user_id', transaction.user_id)
        .single();

      if (notifPrefs && user) {
        await supabaseClient.functions.invoke('send-notification', {
          body: {
            type: notifPrefs.email_enabled && notifPrefs.sms_enabled ? 'both' : notifPrefs.email_enabled ? 'email' : 'sms',
            template: 'transaction-success',
            recipient: {
              email: user.user.email,
              phone: transaction.metadata?.phone_number,
              name: profile?.full_name || user.user.email?.split('@')[0] || 'User',
            },
            data: {
              transactionType: 'Deposit',
              amount: (transaction.amount / 100).toFixed(2),
              currency: transaction.currency,
              reference: reference,
              date: new Date().toLocaleString(),
            },
          },
        }).catch(err => console.error('Notification error:', err));
      }

    } else if (payload.event === 'charge.failed') {
      const transactionId = payload.data.metadata?.transaction_id;

      if (transactionId) {
        await supabaseClient
          .from('transactions')
          .update({
            status: 'failed',
            metadata: { error: payload.data.gateway_response },
          })
          .eq('id', transactionId);

        console.log(`Deposit failed: ${transactionId}`);

        // Send failure notification
        const { data: transaction } = await supabaseClient
          .from('transactions')
          .select('*')
          .eq('id', transactionId)
          .single();

        if (transaction) {
          const { data: profile } = await supabaseClient
            .from('profiles')
            .select('full_name')
            .eq('user_id', transaction.user_id)
            .single();

          const { data: user } = await supabaseClient.auth.admin.getUserById(transaction.user_id);

          const { data: notifPrefs } = await supabaseClient
            .from('notification_preferences')
            .select('*')
            .eq('user_id', transaction.user_id)
            .single();

          if (notifPrefs && user) {
            await supabaseClient.functions.invoke('send-notification', {
              body: {
                type: notifPrefs.email_enabled && notifPrefs.sms_enabled ? 'both' : notifPrefs.email_enabled ? 'email' : 'sms',
                template: 'transaction-failed',
                recipient: {
                  email: user.user.email,
                  phone: transaction.metadata?.phone_number,
                  name: profile?.full_name || user.user.email?.split('@')[0] || 'User',
                },
                data: {
                  transactionType: 'Deposit',
                  amount: (transaction.amount / 100).toFixed(2),
                  currency: transaction.currency,
                  reference: payload.data.reference,
                  reason: payload.data.gateway_response || 'Payment declined',
                },
              },
            }).catch(err => console.error('Notification error:', err));
          }
        }
      }
    }

    return new Response('OK', { status: 200, headers: corsHeaders });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Error', { status: 500, headers: corsHeaders });
  }
});
