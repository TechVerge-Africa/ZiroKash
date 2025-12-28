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
    const { formId, submissionData, amount, payerName, payerEmail } = await req.json();

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
        submission_data: submissionData,
        amount: Math.round(amount * 100), // Store in subunits (pesewas)
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

    // Initialize Paystack payment with split configuration
    const paystackKey = Deno.env.get('PAYSTACK_SECRET_KEY');

    if (!paystackKey) {
      console.error('PAYSTACK_SECRET_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Payment gateway not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build payment payload - amount in pesewas (GHS smallest unit, 1 GHS = 100 pesewas)
    const appBaseUrl = Deno.env.get('APP_BASE_URL') || 'https://kbhyqypwwmkvssrcbfdb.lovableproject.com';
    const paymentPayload: Record<string, any> = {
      email: payerEmail,
      amount: Math.round(amount * 100), // Convert GHS to pesewas
      reference: submission.id,
      callback_url: `${appBaseUrl}/pay/${formId}/success?reference=${submission.id}`,
      metadata: {
        form_id: formId,
        submission_id: submission.id,
        payer_name: payerName || 'Anonymous',
      }
    };

    // Add split payment if merchant has subaccount
    if (merchant?.paystack_subaccount_code) {
      paymentPayload.subaccount = merchant.paystack_subaccount_code;
      // The bearer determines who pays the Paystack transaction fee
      // 'subaccount' means merchant pays, 'account' means ZiroPay pays
      paymentPayload.bearer = 'subaccount';
      console.log(`[Payment Form Submit] Using subaccount: ${merchant.paystack_subaccount_code}`);
    }

    console.log(`[Payment Form Submit] Initializing Paystack payment for ${paymentPayload.amount} pesewas`);

    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentPayload)
    });

    const paystackData = await paystackResponse.json();

    if (!paystackData.status) {
      console.error('Paystack initialization failed:', paystackData);
      return new Response(
        JSON.stringify({
          error: 'Payment initialization failed',
          details: paystackData.message || 'Unknown error from payment gateway'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[Payment Form Submit] Payment initialized successfully: ${paystackData.data.reference}`);

    return new Response(
      JSON.stringify({
        submission_id: submission.id,
        payment_url: paystackData.data.authorization_url,
        reference: paystackData.data.reference
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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