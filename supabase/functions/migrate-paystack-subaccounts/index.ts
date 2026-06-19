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
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!authHeader || !serviceRoleKey || authHeader !== `Bearer ${serviceRoleKey}`) {
      console.error('[Migration] Access denied: invalid or missing authorization header');
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Service Role Key required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { dryRun = true } = await req.json().catch(() => ({}));
    console.log(`[Migration] Starting Paystack subaccount migration. Dry-Run: ${dryRun}`);

    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!paystackSecretKey) {
      throw new Error('PAYSTACK_SECRET_KEY is not configured in Supabase environment variables');
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      serviceRoleKey
    );

    // Fetch all merchants
    const { data: merchants, error: fetchError } = await supabaseAdmin
      .from('merchants')
      .select('*');

    if (fetchError) {
      throw new Error(`Failed to fetch merchants from DB: ${fetchError.message}`);
    }

    if (!merchants || merchants.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No merchants found in database',
          results: []
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[Migration] Found ${merchants.length} merchants to evaluate`);

    const results = [];

    for (const merchant of merchants) {
      const merchantInfo = {
        id: merchant.id,
        business_name: merchant.business_name,
        email: merchant.business_email,
        old_subaccount_code: merchant.paystack_subaccount_code,
        status: 'pending',
        details: ''
      };

      // 1. Validate if we have the necessary settlement details to create a subaccount
      if (!merchant.settlement_bank_code || !merchant.settlement_account_number) {
        merchantInfo.status = 'skipped';
        merchantInfo.details = 'Missing settlement bank code or account number';
        results.push(merchantInfo);
        console.log(`[Migration] Skipped merchant ${merchant.business_name} (${merchant.id}): ${merchantInfo.details}`);
        continue;
      }

      // 2. If merchant already has a subaccount, check if it exists on the new Paystack account
      let existsOnNewAccount = false;
      if (merchant.paystack_subaccount_code) {
        try {
          console.log(`[Migration] Verifying subaccount ${merchant.paystack_subaccount_code} on new Paystack account...`);
          const verifyResponse = await fetch(`https://api.paystack.co/subaccount/${merchant.paystack_subaccount_code}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${paystackSecretKey}`,
            }
          });

          if (verifyResponse.status === 200) {
            const verifyData = await verifyResponse.json();
            if (verifyData.status === true) {
              existsOnNewAccount = true;
              merchantInfo.status = 'skipped';
              merchantInfo.details = `Subaccount ${merchant.paystack_subaccount_code} is already valid on the new Paystack account`;
              results.push(merchantInfo);
              console.log(`[Migration] Merchant ${merchant.business_name} already has a valid subaccount: ${merchant.paystack_subaccount_code}`);
              continue;
            }
          } else {
            console.log(`[Migration] Subaccount ${merchant.paystack_subaccount_code} not found on new account (status code: ${verifyResponse.status}). Will recreate.`);
          }
        } catch (err) {
          console.warn(`[Migration] Error checking subaccount validity for ${merchant.business_name}:`, err);
        }
      }

      // 3. Re-create subaccount on the new Paystack account
      if (dryRun) {
        merchantInfo.status = 'would_recreate';
        merchantInfo.details = `Dry-run: Would create subaccount for bank ${merchant.settlement_bank_code}, account ending in ${merchant.settlement_account_number.slice(-4)}`;
        results.push(merchantInfo);
        console.log(`[Migration] [Dry-Run] Merchant ${merchant.business_name} would be recreated`);
      } else {
        try {
          console.log(`[Migration] Recreating subaccount for merchant ${merchant.business_name}...`);
          const commissionPercentage = Math.round((Number(merchant.commission_rate) || 0.01) * 100);
          
          const createResponse = await fetch('https://api.paystack.co/subaccount', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${paystackSecretKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              business_name: merchant.business_name,
              settlement_bank: merchant.settlement_bank_code,
              account_number: merchant.settlement_account_number,
              percentage_charge: commissionPercentage,
              primary_contact_email: merchant.business_email || 'settlement@zirokash.com',
            }),
          });

          const createData = await createResponse.json();

          if (!createResponse.ok || !createData.status) {
            merchantInfo.status = 'failed';
            merchantInfo.details = `Paystack creation failed: ${createData.message || 'Unknown API error'}`;
            results.push(merchantInfo);
            console.error(`[Migration] Paystack creation failed for ${merchant.business_name}:`, createData);
            continue;
          }

          const newSubaccountCode = createData.data.subaccount_code;
          console.log(`[Migration] Subaccount created successfully: ${newSubaccountCode}. Updating database...`);

          // 4. Update database with new subaccount code
          const { error: updateError } = await supabaseAdmin
            .from('merchants')
            .update({
              paystack_subaccount_code: newSubaccountCode,
              updated_at: new Date().toISOString(),
              verification_status: 'verified' // Maintain verified status
            })
            .eq('id', merchant.id);

          if (updateError) {
            merchantInfo.status = 'partially_failed';
            merchantInfo.details = `Created subaccount ${newSubaccountCode} but database update failed: ${updateError.message}`;
            results.push(merchantInfo);
            console.error(`[Migration] Database update failed for ${merchant.business_name}:`, updateError);
          } else {
            merchantInfo.status = 'success';
            merchantInfo.details = `Successfully migrated to new subaccount: ${newSubaccountCode}`;
            results.push(merchantInfo);
            console.log(`[Migration] Successfully migrated merchant ${merchant.business_name} to ${newSubaccountCode}`);
          }

        } catch (err: any) {
          merchantInfo.status = 'failed';
          merchantInfo.details = `Exception during migration: ${err.message}`;
          results.push(merchantInfo);
          console.error(`[Migration] Exception for ${merchant.business_name}:`, err);
        }
      }
    }

    const summary = {
      total: merchants.length,
      skipped: results.filter(r => r.status === 'skipped').length,
      success: results.filter(r => r.status === 'success').length,
      would_recreate: results.filter(r => r.status === 'would_recreate').length,
      failed: results.filter(r => r.status === 'failed' || r.status === 'partially_failed').length,
    };

    return new Response(
      JSON.stringify({
        success: true,
        dryRun,
        summary,
        results
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('[Migration] Server error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
