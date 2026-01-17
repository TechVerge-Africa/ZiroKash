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

        // Check if user is admin
        const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .single();

        if (roleError || roleData?.role !== 'admin') {
            return new Response(
                JSON.stringify({ error: 'Admin access required' }),
                { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        const { subaccountCode, percentageCharge, updateAll } = await req.json();

        // Validate percentage charge
        if (percentageCharge === undefined || percentageCharge < 0 || percentageCharge > 100) {
            return new Response(
                JSON.stringify({ error: 'percentageCharge must be between 0 and 100' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
        if (!paystackSecretKey) {
            throw new Error('PAYSTACK_SECRET_KEY is not configured');
        }

        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        // Helper function to update a single subaccount
        const updateSingleSubaccount = async (code: string, percentage: number) => {
            try {
                console.log(`[Update Subaccount] Updating ${code} to ${percentage}%`);

                // Update on Paystack
                const response = await fetch(`https://api.paystack.co/subaccount/${code}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${paystackSecretKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        percentage_charge: percentage
                    }),
                });

                const data = await response.json();

                if (!data.status) {
                    console.error(`[Update Subaccount] Paystack error for ${code}:`, data);
                    return {
                        success: false,
                        subaccountCode: code,
                        error: data.message || 'Failed to update on Paystack'
                    };
                }

                // Update in database (convert percentage to decimal)
                const commissionRate = percentage / 100;
                const { error: dbError } = await supabaseAdmin
                    .from('merchants')
                    .update({
                        commission_rate: commissionRate,
                        updated_at: new Date().toISOString()
                    })
                    .eq('paystack_subaccount_code', code);

                if (dbError) {
                    console.error(`[Update Subaccount] DB error for ${code}:`, dbError);
                    return {
                        success: false,
                        subaccountCode: code,
                        error: 'Updated on Paystack but failed to update database',
                        dbError: dbError.message
                    };
                }

                console.log(`[Update Subaccount] Successfully updated ${code}`);
                return {
                    success: true,
                    subaccountCode: code,
                    percentageCharge: percentage,
                    commissionRate: commissionRate
                };

            } catch (error) {
                console.error(`[Update Subaccount] Error updating ${code}:`, error);
                return {
                    success: false,
                    subaccountCode: code,
                    error: error.message
                };
            }
        };

        // Single update mode
        if (!updateAll && subaccountCode) {
            const result = await updateSingleSubaccount(subaccountCode, percentageCharge);

            if (!result.success) {
                return new Response(
                    JSON.stringify(result),
                    { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                );
            }

            return new Response(
                JSON.stringify(result),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Batch update mode
        if (updateAll) {
            console.log(`[Update Subaccount] Starting batch update to ${percentageCharge}%`);

            // Fetch all merchants with subaccounts
            const { data: merchants, error: fetchError } = await supabaseAdmin
                .from('merchants')
                .select('id, business_name, paystack_subaccount_code')
                .not('paystack_subaccount_code', 'is', null);

            if (fetchError) {
                throw new Error(`Failed to fetch merchants: ${fetchError.message}`);
            }

            if (!merchants || merchants.length === 0) {
                return new Response(
                    JSON.stringify({
                        success: true,
                        message: 'No merchants with subaccounts found',
                        updated: 0,
                        failed: 0,
                        results: []
                    }),
                    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                );
            }

            console.log(`[Update Subaccount] Found ${merchants.length} merchants to update`);

            // Update all subaccounts
            const results = await Promise.all(
                merchants.map(merchant =>
                    updateSingleSubaccount(merchant.paystack_subaccount_code!, percentageCharge)
                )
            );

            const successful = results.filter(r => r.success);
            const failed = results.filter(r => !r.success);

            console.log(`[Update Subaccount] Batch complete: ${successful.length} succeeded, ${failed.length} failed`);

            return new Response(
                JSON.stringify({
                    success: true,
                    message: `Updated ${successful.length} of ${merchants.length} merchants`,
                    updated: successful.length,
                    failed: failed.length,
                    results: results
                }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Invalid request
        return new Response(
            JSON.stringify({
                error: 'Either provide subaccountCode for single update or set updateAll=true for batch update'
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('[Update Subaccount] Unexpected error:', error);
        return new Response(
            JSON.stringify({
                error: 'Failed to update subaccount',
                details: error.message
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
