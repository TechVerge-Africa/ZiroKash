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
      .select('*, fee_bearer')
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

    // Fee calculation logic
    const PAYSTACK_PERCENTAGE = 0.0195; // 1.95%
    const PAYSTACK_CAP = 10000; // GHS 100 in pesewas

    // amount is passed in pesewas from the frontend for total payment
    // originalAmount is in GHS
    const baseAmountPesewas = Math.round(originalAmount * 100);
    const feeBearer = form.fee_bearer || 'customer';

    let finalAmountPesewas = baseAmountPesewas;
    let processingFeePesewas = 0;

    if (feeBearer === 'customer') {
      // Formula: finalAmount = baseAmount / (1 - 0.0195)
      const calculatedFee = Math.round(baseAmountPesewas * PAYSTACK_PERCENTAGE / (1 - PAYSTACK_PERCENTAGE));
      processingFeePesewas = Math.min(calculatedFee, PAYSTACK_CAP);
      finalAmountPesewas = baseAmountPesewas + processingFeePesewas;
    } else {
      // Merchant pays - amount stays same, fee deducted from settlement
      processingFeePesewas = Math.min(Math.round(baseAmountPesewas * PAYSTACK_PERCENTAGE), PAYSTACK_CAP);
      finalAmountPesewas = baseAmountPesewas;
    }

    console.log(`[Payment] Bearer: ${feeBearer}, Base: ${baseAmountPesewas}, Fee: ${processingFeePesewas}, Total: ${finalAmountPesewas}`);

    // Get merchant subaccount via user_id
    const { data: merchant } = await supabase
      .from('merchants')
      .select('paystack_subaccount_code, paystack_subaccount_code_v2')
      .eq('user_id', form.user_id)
      .maybeSingle();

    // Create submission
    const { data: submission, error: submissionError } = await supabase
      .from('form_submissions')
      .insert({
        form_id: formId,
        submission_data: {
          ...submissionData,
          original_amount: originalAmount,
          fee_amount: processingFeePesewas / 100,
          total_amount: finalAmountPesewas / 100,
          fee_bearer: feeBearer
        },
        amount: finalAmountPesewas,
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

    const primaryPublicKey = Deno.env.get('PAYSTACK_PRIMARY_PUBLIC_KEY');
    const backupPublicKey = Deno.env.get('PAYSTACK_PUBLIC_KEY') || Deno.env.get('VITE_PAYSTACK_PUBLIC_KEY');

    // Construct response with both configs
    // 'bearer' logic: 'account' if customer pays, 'subaccount' if merchant pays
    const paystackBearer = feeBearer === 'customer' ? 'account' : 'subaccount';

    const gateways = {
      primary: primaryPublicKey ? {
        key: primaryPublicKey,
        subaccount: merchant?.paystack_subaccount_code_v2 || undefined,
        bearer: paystackBearer,
        label: 'Primary Gateway'
      } : null,
      backup: backupPublicKey ? {
        key: backupPublicKey,
        subaccount: merchant?.paystack_subaccount_code || undefined,
        bearer: paystackBearer,
        label: 'Backup Gateway'
      } : null
    };

    return new Response(
      JSON.stringify({
        status: 'success',
        gateways,
        email: payerEmail,
        amount: finalAmountPesewas,
        reference: submission.id,
        fee_breakdown: {
          base_amount: originalAmount,
          processing_fee: processingFeePesewas / 100,
          total_amount: finalAmountPesewas / 100,
          fee_bearer: feeBearer,
          currency: 'GHS'
        },
        metadata: {
          form_id: formId,
          submission_id: submission.id,
          payer_name: payerName || 'Anonymous',
          base_amount_pesewas: baseAmountPesewas,
          processing_fee_pesewas: processingFeePesewas,
          fee_bearer: feeBearer
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