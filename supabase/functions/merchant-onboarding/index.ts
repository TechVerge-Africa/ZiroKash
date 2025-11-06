import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const {
      businessName,
      businessType,
      businessEmail,
      businessPhone,
      businessAddress,
      businessRegistration,
      description,
    } = await req.json();

    console.log('Processing merchant application for user:', user.id);

    // Check if merchant already exists
    const { data: existingMerchant } = await supabaseClient
      .from('merchants')
      .select('id, verification_status')
      .eq('user_id', user.id)
      .single();

    if (existingMerchant) {
      return new Response(
        JSON.stringify({ 
          error: 'Merchant account already exists',
          status: existingMerchant.verification_status 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Create merchant record
    const { data: merchant, error: merchantError } = await supabaseClient
      .from('merchants')
      .insert({
        user_id: user.id,
        business_name: businessName,
        business_email: businessEmail,
        business_phone: businessPhone,
        business_address: businessAddress,
        business_registration_number: businessRegistration || null,
        verification_status: 'pending',
        is_active: false,
      })
      .select()
      .single();

    if (merchantError) {
      console.error('Error creating merchant:', merchantError);
      throw merchantError;
    }

    console.log('Merchant created successfully:', merchant.id);

    // Send confirmation email
    try {
      await supabaseClient.functions.invoke('send-notification', {
        body: {
          type: 'merchant_application',
          to: businessEmail,
          data: {
            businessName,
            businessType,
            applicantEmail: user.email,
          },
        },
      });
      console.log('Confirmation email sent');
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Don't fail the request if email fails
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        merchantId: merchant.id,
        message: 'Application submitted successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Merchant onboarding error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
