import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      formId,
      submissionData,
      originalAmount,
      amount, // Total amount in pesewas 
      feeAmount,
      payerName,
      payerEmail,
      redirectOrigin
    } = await req.json();

    // Validate required fields
    if (!formId || !amount || !payerEmail) {
      console.error('Missing required fields:', { formId, amount, payerEmail });
      return new Response(
        JSON.stringify({ error: 'Missing required fields: formId, amount, and payerEmail are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate amount is positive
    if (amount <= 0) {
      console.error('Invalid amount:', amount);
      return new Response(
        JSON.stringify({ error: 'Amount must be greater than 0' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log(`[Payment Form Submit] Processing form: ${formId}, amount: ${amount}, payer: ${payerEmail}`);

    // Verify form exists and is active
    const { data: form, error: formError } = await supabase
      .from('payment_forms')
      .select('*')
      .eq('id', formId)
      .eq('is_active', true)
      .maybeSingle();

    if (formError) {
      console.error('Form query error:', formError);
      return new Response(
        JSON.stringify({ error: 'Error fetching form' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!form) {
      console.error('Form not found or inactive:', formId);
      return new Response(
        JSON.stringify({ error: 'Form not found or inactive' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get merchant subaccount via user_id (separate query to avoid join issues)
    const { data: merchant } = await supabase
      .from('merchants')
      .select('paystack_subaccount_code')
      .eq('user_id', form.user_id)
      .maybeSingle();

    console.log(`[Payment Form Submit] Merchant subaccount: ${merchant?.paystack_subaccount_code || 'none'}`);

    // Create submission
    const { data: submission, error: submissionError } = await supabase
      .from('form_submissions')
      .insert({
        form_id: formId,
        submission_data: {
          ...submissionData,
          original_amount: originalAmount,
          fee_amount: feeAmount,
          total_amount: amount / 100, // Store total in GHS 
        },
        amount: amount, // Store total in pesewas
        payer_name: payerName || 'Anonymous',
        payer_email: payerEmail,
        status: 'pending'
      })
      .select()
      .single();

    if (submissionError) {
      console.error('Submission error:', submissionError);
      return new Response(
        JSON.stringify({ error: 'Failed to create submission', details: submissionError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[Payment Form Submit] Submission created: ${submission.id}`);

    // For InlineJS, we don't call transaction/initialize on the server.
    // Instead, we return the data needed for the frontend PaystackPop instance.
    // Check for Primary Key (New Account)
    const primaryPublicKey = Deno.env.get('PAYSTACK_PRIMARY_PUBLIC_KEY');

    // Check for Backup Key (Existing Account - currently mapped to PAYSTACK_PUBLIC_KEY or VITE_PAYSTACK_PUBLIC_KEY)
    const backupPublicKey = Deno.env.get('PAYSTACK_PUBLIC_KEY') || Deno.env.get('VITE_PAYSTACK_PUBLIC_KEY');

    if (!primaryPublicKey && !backupPublicKey) {
      console.error('[Payment Form Submit] No Paystack Public Keys configured');
      return new Response(
        JSON.stringify({
          status: 'error',
          error: 'Payment gateway configuration error',
          details: 'No payment keys (Primary or Backup) are configured.'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!submission?.id) {
      console.error('[Payment Form Submit] Submission ID missing despite successful insert');
      return new Response(
        JSON.stringify({
          status: 'error',
          error: 'Internal server error: Failed to generate submission reference'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[Payment Form Submit] Returning dual-gateway config for reference: ${submission.id}`);

    // Construct response with both configs
    const gateways = {
      primary: primaryPublicKey ? {
        key: primaryPublicKey,
        // Primary account uses the NEW subaccount code (v2)
        subaccount: merchant?.paystack_subaccount_code_v2 || undefined,
        label: 'Primary Gateway'
      } : null,
      backup: backupPublicKey ? {
        key: backupPublicKey,
        // Backup uses the existing merchant subaccount code from the database
        subaccount: merchant?.paystack_subaccount_code || undefined,
        label: 'Backup Gateway'
      } : null
    };

    return new Response(
      JSON.stringify({
        status: 'success',
        gateways,
        email: payerEmail,
        amount: amount, // In pesewas
        reference: submission.id,
        metadata: {
          form_id: formId,
          submission_id: submission.id,
          payer_name: payerName || 'Anonymous',
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Payment Form Submit] Unexpected error:', error);
    return new Response(
      JSON.stringify({
        error: 'An unexpected error occurred',
        details: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});