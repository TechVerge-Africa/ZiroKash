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
      console.error('Invalid signature');
      return new Response('Invalid signature', { status: 401 });
    }

    const event = JSON.parse(body);
    console.log('Webhook event:', event.event);

    if (event.event === 'charge.success') {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      const { reference, metadata } = event.data;
      const submissionId = metadata.submission_id;

      // Update submission status
      const { error: updateError } = await supabase
        .from('form_submissions')
        .update({
          status: 'paid',
          transaction_id: reference
        })
        .eq('id', submissionId);

      if (updateError) {
        console.error('Update error:', updateError);
        return new Response('Error updating submission', { status: 500 });
      }

      console.log(`Submission ${submissionId} marked as paid`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});