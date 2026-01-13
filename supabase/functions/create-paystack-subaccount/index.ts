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

    const primarySecretKey = Deno.env.get('PAYSTACK_PRIMARY_SECRET_KEY');
    const backupSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');

    if (!primarySecretKey && !backupSecretKey) {
      throw new Error('No PAYSTACK_SECRET_KEYs configured (Primary or Backup)');
    }

    let primarySubaccountCode = null;
    let backupSubaccountCode = null;
    const errors = [];

    // Helper function to create subaccount
    const createSubaccount = async (secretKey: string, label: string) => {
      try {
        console.log(`Attempting to create ${label} subaccount...`);
        const response = await fetch('https://api.paystack.co/subaccount', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${secretKey}`,
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
          console.error(`${label} subaccount creation failed:`, data);
          throw new Error(data.message || `Failed to create ${label} subaccount`);
        }

        console.log(`${label} subaccount created: ${data.data.subaccount_code}`);
        return data.data;
      } catch (err) {
        console.error(`Error creating ${label} subaccount:`, err);
        errors.push(`${label}: ${err.message}`);
        return null;
      }
    };

    // 1. Attempt Primary Creation
    if (primarySecretKey) {
      const primaryData = await createSubaccount(primarySecretKey, 'Primary');
      if (primaryData) {
        primarySubaccountCode = primaryData.subaccount_code;
      }
    }

    // 2. Attempt Backup Creation (only if it's a different key)
    if (backupSecretKey) {
      if (backupSecretKey === primarySecretKey) {
        console.log('Skipping backup creation: Key is identical to Primary key.');
        // If we only have one key, we use it for both slots for compatibility
        backupSubaccountCode = primarySubaccountCode;
      } else {
        const backupData = await createSubaccount(backupSecretKey, 'Backup');
        if (backupData) {
          backupSubaccountCode = backupData.subaccount_code;
        }
      }
    }

    // 3. Validation: We need at least one success to proceed, preferably Primary
    if (!primarySubaccountCode && !backupSubaccountCode) {
      return new Response(
        JSON.stringify({
          error: 'Failed to create subaccount on any gateway',
          details: errors
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update merchant record with available subaccount details
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const updatePayload: any = {
      settlement_bank_code: bankCode,
      settlement_account_number: accountNumber,
      settlement_account_name: accountName,
      commission_rate: percentageCharge / 100, // Ensure DB matches Paystack split
      verification_status: 'verified', // Mark merchant as verified when subaccount setup is complete
      updated_at: new Date().toISOString(),
    };

    if (primarySubaccountCode) {
      updatePayload.paystack_subaccount_code_v2 = primarySubaccountCode;
    }

    // Always update legacy/backup code if we got one - facilitates the "switch back" logic
    if (backupSubaccountCode) {
      updatePayload.paystack_subaccount_code = backupSubaccountCode;
    }

    // Try to update with v2 column first
    let updateResult = await supabaseAdmin
      .from('merchants')
      .update(updatePayload)
      .eq('user_id', user.id);

    // If update failed and we tried to set v2, it might be because the column doesn't exist yet
    // Retry without v2 column
    if (updateResult.error && primarySubaccountCode) {
      console.log('Update with v2 failed, retrying without v2 column:', updateResult.error);
      const fallbackPayload: any = {
        settlement_bank_code: bankCode,
        settlement_account_number: accountNumber,
        settlement_account_name: accountName,
        commission_rate: percentageCharge / 100,
        verification_status: 'verified',
        updated_at: new Date().toISOString(),
      };

      if (backupSubaccountCode) {
        fallbackPayload.paystack_subaccount_code = backupSubaccountCode;
      }

      updateResult = await supabaseAdmin
        .from('merchants')
        .update(fallbackPayload)
        .eq('user_id', user.id);
    }

    if (updateResult.error) {
      console.error('Failed to update merchant:', updateResult.error);
      return new Response(
        JSON.stringify({
          warning: 'Subaccounts created but database update failed',
          primary: primarySubaccountCode,
          backup: backupSubaccountCode,
          error: updateResult.error.message
        }),
        { status: 207, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        primarySubaccount: primarySubaccountCode,
        backupSubaccount: backupSubaccountCode,
        businessName: businessName, // Assume same for both
        warnings: errors.length > 0 ? errors : undefined
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
