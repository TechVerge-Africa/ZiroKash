import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.177.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-paystack-signature',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get('x-paystack-signature');
    const body = await req.text();

    console.log('[Form Payment Webhook] Received webhook request');

    // Verify Paystack signature
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

    if (hash !== signature) {
      console.error('[Form Payment Webhook] Invalid signature. Expected:', hash, 'Received:', signature);
      return new Response('Invalid signature', { status: 401 });
    }

    console.log('[Form Payment Webhook] Signature verified successfully');

    const event = JSON.parse(body);
    console.log(`[Form Payment Webhook] Event type: ${event.event}`);

    if (event.event === 'charge.success') {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      const { reference, metadata, amount, status, gateway_response, fees } = event.data;
      const subaccount = event.data.subaccount;
      const submissionId = metadata?.submission_id || reference;

      const netAmount = amount - (fees || 0);

      console.log(`[Form Payment Webhook] Processing successful payment for submission: ${submissionId}`);
      console.log(`[Form Payment Webhook] Auth: ${event.data.authorization?.brand || 'unknown'}, Reference: ${reference}, Gateway Ref: ${event.data.reference}`);
      console.log(`[Form Payment Webhook] Status: ${status}, Amount: ${amount}, Fees: ${fees || 0}, Net: ${netAmount}, Response: ${gateway_response}`);

      if (subaccount) {
        console.log(`[Form Payment Webhook] Subaccount involved: ${subaccount.subaccount_code} (Percentage: ${subaccount.percentage_charge}%)`);
      }

      // Robust lookup for the submission
      let targetSubmissionId = submissionId;
      let isAlreadyPaid = false;

      const { data: existingSub, error: lookupError } = await supabase
        .from('form_submissions')
        .select('id, status')
        .or(`id.eq.${submissionId},transaction_id.eq.${reference}`)
        .maybeSingle();

      if (lookupError) {
        console.error('[Form Payment Webhook] Lookup error:', lookupError);
      }

      if (existingSub) {
        targetSubmissionId = existingSub.id;
        isAlreadyPaid = existingSub.status === 'paid';
        console.log(`[Form Payment Webhook] Found matching submission: ${targetSubmissionId}, current status: ${existingSub.status}`);
      } else {
        console.warn(`[Form Payment Webhook] No matching submission found for reference: ${reference} or metadata: ${submissionId}`);
      }

      if (isAlreadyPaid) {
        console.log(`[Form Payment Webhook] Submission ${targetSubmissionId} is already marked as 'paid'. Skipping update and credit.`);
        return new Response(JSON.stringify({ received: true, message: 'Already processed' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Update submission status
      const { error: updateError } = await supabase
        .from('form_submissions')
        .update({
          status: 'paid',
          transaction_id: reference,
          net_amount: netAmount,
          fees: fees || 0
        })
        .eq('id', targetSubmissionId);

      if (updateError) {
        console.error('[Form Payment Webhook] Update error:', updateError);
        return new Response(
          JSON.stringify({ error: 'Error updating submission', details: updateError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`[Form Payment Webhook] Submission ${targetSubmissionId} marked as paid`);

      // Credit the merchant's wallet
      try {
        console.log(`[Form Payment Webhook] Fetching submission and form details for wallet credit...`);
        const { data: submissionData } = await supabase
          .from('form_submissions')
          .select(`
            amount,
            net_amount,
            form_id
          `)
          .eq('id', targetSubmissionId) // Use the resolved target ID
          .single();

        if (submissionData) {
          const { data: formData } = await supabase
            .from('payment_forms')
            .select('user_id')
            .eq('id', submissionData.form_id)
            .single();

          if (formData) {
            console.log(`[Form Payment Webhook] Crediting wallet for user: ${formData.user_id}`);
            // Use net_amount if available, otherwise fallback to amount (converted to GHS)
            const creditAmount = (submissionData.net_amount || submissionData.amount) / 100;

            const { error: walletError } = await supabase.rpc('increment_wallet_balance', {
              _user_id: formData.user_id,
              _wallet_type: 'merchant',
              _amount: creditAmount,
              _currency: 'GHS'
            });

            if (walletError) {
              console.error('[Form Payment Webhook] Wallet credit error:', walletError);
            } else {
              console.log(`[Form Payment Webhook] Successfully credited ${creditAmount} GHS to merchant wallet`);
            }
          } else {
            console.warn(`[Form Payment Webhook] Could not find form data for form_id: ${submissionData.form_id}`);
          }
        } else {
          console.warn(`[Form Payment Webhook] Could not find submission data for ID: ${targetSubmissionId}`);
        }
      } catch (creditError) {
        console.error('[Form Payment Webhook] Unexpected credit error:', creditError);
      }

      // Trigger notifications (Merchant + Payer)
      try {
        console.log(`[Form Payment Webhook] Triggering notifications...`);

        // 1. Get Submission details
        const { data: sub } = await supabase
          .from('form_submissions')
          .select('payer_name, payer_email, amount, form_id')
          .eq('id', targetSubmissionId)
          .single();

        if (sub) {
          // 2. Get Merchant details and preferences
          const { data: formDetails } = await supabase
            .from('payment_forms')
            .select('user_id, title')
            .eq('id', sub.form_id)
            .single();

          if (formDetails) {
            const [
              { data: merchantProfile },
              { data: merchantPrefs }
            ] = await Promise.all([
              supabase.from('profiles').select('full_name, email, phone').eq('user_id', formDetails.user_id).single(),
              supabase.from('notification_preferences').select('*').eq('user_id', formDetails.user_id).single()
            ]);

            // Notify Merchant
            if (merchantProfile && merchantPrefs) {
              const channels = [];
              if (merchantPrefs.email_enabled) channels.push('email');
              if (merchantPrefs.sms_enabled) channels.push('sms');
              if (merchantPrefs.whatsapp_enabled) channels.push('whatsapp');

              if (channels.length > 0) {
                console.log(`[Form Payment Webhook] Notifying merchant ${merchantProfile.email} via ${channels.join(', ')}`);
                await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-notification`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
                  },
                  body: JSON.stringify({
                    type: channels.length === 3 ? 'all' : channels[0], // Simplified channel selection
                    template: 'merchant-payment-received',
                    recipient: {
                      email: merchantProfile.email,
                      phone: merchantProfile.phone,
                      name: merchantProfile.full_name || 'Merchant',
                    },
                    data: {
                      formName: formDetails.title,
                      amount: (sub.amount / 100).toFixed(2),
                      currency: 'GHS',
                      reference: targetSubmissionId,
                      merchantName: sub.payer_name || 'a customer'
                    },
                  }),
                });
              }
            }
          }

          // Notify Payer
          if (sub.payer_email) {
            console.log(`[Form Payment Webhook] Sending 'transaction-success' to ${sub.payer_email}`);
            await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-notification`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
              },
              body: JSON.stringify({
                type: 'email',
                template: 'transaction-success',
                recipient: {
                  email: sub.payer_email,
                  name: sub.payer_name || 'Valued Payer',
                },
                data: {
                  transactionType: 'Form Payment',
                  amount: (sub.amount / 100).toFixed(2),
                  currency: 'GHS',
                  reference: targetSubmissionId,
                  date: new Date().toLocaleString(),
                },
              }),
            });
          }
        }
      } catch (notifyError) {
        console.error('[Form Payment Webhook] Notification error:', notifyError);
      }
    } else {
      console.log(`[Form Payment Webhook] Ignoring event type: ${event.event}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[Form Payment Webhook] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});