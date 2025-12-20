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

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify form exists and is active, also get merchant subaccount if exists
    const { data: form, error: formError } = await supabase
      .from('payment_forms')
      .select('*, merchants!inner(paystack_subaccount_code)')
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
      return new Response(
        JSON.stringify({ error: 'Form not found or inactive' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Try to get merchant subaccount via user_id
    const { data: merchant } = await supabase
      .from('merchants')
      .select('paystack_subaccount_code')
      .eq('user_id', form.user_id)
      .maybeSingle();

    console.log(`Processing payment for form: ${formId}, merchant subaccount: ${merchant?.paystack_subaccount_code || 'none'}`);

    // Create submission
    const { data: submission, error: submissionError } = await supabase
      .from('form_submissions')
      .insert({
        form_id: formId,
        submission_data: submissionData,
        amount: amount,
        payer_name: payerName,
        payer_email: payerEmail,
        status: 'pending'
      })
      .select()
      .single();

    if (submissionError) {
      console.error('Submission error:', submissionError);
      return new Response(
        JSON.stringify({ error: 'Failed to create submission' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Paystack payment with split configuration
    const paystackKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    
    // Build payment payload
    const paymentPayload: Record<string, any> = {
      email: payerEmail,
      amount: amount * 100, // Paystack expects amount in kobo/pesewas
      reference: submission.id,
      callback_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/form-payment-webhook`,
      metadata: {
        form_id: formId,
        submission_id: submission.id,
        payer_name: payerName,
      }
    };

    // Add split payment if merchant has subaccount
    if (merchant?.paystack_subaccount_code) {
      paymentPayload.subaccount = merchant.paystack_subaccount_code;
      // The bearer determines who pays the Paystack transaction fee
      // 'subaccount' means merchant pays, 'account' means ZiroPay pays
      paymentPayload.bearer = 'subaccount';
      console.log(`Using subaccount: ${merchant.paystack_subaccount_code}`);
    }

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
      console.error('Paystack error:', paystackData);
      return new Response(
        JSON.stringify({ error: 'Payment initialization failed', details: paystackData.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Payment initialized: ${paystackData.data.reference}`);

    return new Response(
      JSON.stringify({
        submission_id: submission.id,
        payment_url: paystackData.data.authorization_url,
        reference: paystackData.data.reference
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});