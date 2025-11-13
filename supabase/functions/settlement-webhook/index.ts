import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createSupabaseClient } from '../_shared/db.ts';
import { PaystackService } from '../_shared/paystack.ts';
import { handleError } from '../_shared/errors.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const paystack = new PaystackService();
    const signature = req.headers.get('x-paystack-signature');
    
    if (!signature) {
      return new Response(
        JSON.stringify({ error: 'No signature provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.text();
    
    // Verify webhook signature
    const isValid = paystack.verifyWebhookSignature(body, signature);
    
    if (!isValid) {
      console.error('Invalid webhook signature');
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const event = JSON.parse(body);
    console.log('Settlement webhook event:', event.event);

    const supabase = createSupabaseClient();

    // Handle transfer success
    if (event.event === 'transfer.success') {
      const reference = event.data.reference;
      
      const { data: settlements, error } = await supabase
        .from('settlements')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('paystack_reference', reference)
        .select('*, merchants(*)');

      if (error) {
        console.error('Failed to update settlement:', error);
        throw error;
      }

      if (settlements && settlements.length > 0) {
        const settlement = settlements[0];
        const merchant = settlement.merchants;

        // Send success notification
        await supabase.functions.invoke('send-notification', {
          body: {
            type: 'settlement_completed',
            to: merchant.business_email,
            data: {
              merchant_name: merchant.business_name,
              amount: settlement.amount,
              reference: reference,
              settlement_type: settlement.settlement_type,
            },
          },
        });
      }
    }

    // Handle transfer failure
    if (event.event === 'transfer.failed' || event.event === 'transfer.reversed') {
      const reference = event.data.reference;
      
      await supabase
        .from('settlements')
        .update({
          status: 'failed',
          error_message: event.data.status || 'Transfer failed',
        })
        .eq('paystack_reference', reference);

      // Optionally send failure notification
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Settlement webhook error:', error);
    return handleError(error);
  }
});
