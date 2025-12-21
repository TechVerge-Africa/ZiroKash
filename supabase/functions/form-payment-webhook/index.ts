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
      console.error('[Form Payment Webhook] Invalid signature');
      return new Response('Invalid signature', { status: 401 });
    }

    const event = JSON.parse(body);
    console.log(`[Form Payment Webhook] Event type: ${event.event}`);

    if (event.event === 'charge.success') {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      const { reference, metadata, amount, status } = event.data;
      const submissionId = metadata?.submission_id || reference;

      console.log(`[Form Payment Webhook] Processing successful payment for submission: ${submissionId}`);
      console.log(`[Form Payment Webhook] Amount: ${amount} pesewas, Status: ${status}`);

      // Update submission status
      const { error: updateError } = await supabase
        .from('form_submissions')
        .update({
          status: 'paid',
          transaction_id: reference
        })
        .eq('id', submissionId);

      if (updateError) {
        console.error('[Form Payment Webhook] Update error:', updateError);
        return new Response(
          JSON.stringify({ error: 'Error updating submission', details: updateError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`[Form Payment Webhook] Submission ${submissionId} marked as paid`);
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