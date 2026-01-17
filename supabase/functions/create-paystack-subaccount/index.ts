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
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Authentication failed' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const {
      businessName,
      bankCode,
      accountNumber,
      accountName,
      percentageCharge = 1 // ZiroKash takes 1% by default
    } = await req.json();

    if (!businessName || !bankCode || !accountNumber || !accountName) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Creating subaccount for: ${businessName}`);

    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');

    if (!paystackSecretKey) {
      throw new Error('PAYSTACK_SECRET_KEY is not configured');
    }

    // Create subaccount on Paystack
    console.log('Creating Paystack subaccount...');
    const response = await fetch('https://api.paystack.co/subaccount', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        business_name: businessName,
        settlement_bank: bankCode,
        account_number: accountNumber,
        percentage_charge: percentageCharge,
        primary_contact_email: user.email,
      }),
    });

    const data = await response.json();

    if (!data.status) {
      console.error('Subaccount creation failed:', data);
      return new Response(
        JSON.stringify({
          error: data.message || 'Failed to create subaccount',
          details: data
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const subaccountCode = data.data.subaccount_code;
    console.log(`Subaccount created: ${subaccountCode}`);

    // Update merchant record with subaccount details
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const updatePayload = {
      paystack_subaccount_code: subaccountCode,
      settlement_bank_code: bankCode,
      settlement_account_number: accountNumber,
      settlement_account_name: accountName,
      commission_rate: percentageCharge / 100, // Ensure DB matches Paystack split
      verification_status: 'verified', // Mark merchant as verified when subaccount setup is complete
      updated_at: new Date().toISOString(),
    };

    const { error: updateError } = await supabaseAdmin
      .from('merchants')
      .update(updatePayload)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Failed to update merchant:', updateError);
      return new Response(
        JSON.stringify({
          warning: 'Subaccount created but database update failed',
          subaccount: subaccountCode,
          error: updateError.message
        }),
        { status: 207, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        subaccount: subaccountCode,
        businessName: businessName
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );


  } catch (error) {
    console.error('Error creating subaccount:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
