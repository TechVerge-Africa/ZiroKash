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

        const { subaccountCode } = await req.json();

        if (!subaccountCode) {
            return new Response(
                JSON.stringify({ error: 'subaccountCode is required' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
        if (!paystackSecretKey) {
            throw new Error('PAYSTACK_SECRET_KEY is not configured');
        }

        console.log(`[Check Subaccount] Fetching details for: ${subaccountCode}`);

        // Fetch subaccount details from Paystack
        const response = await fetch(`https://api.paystack.co/subaccount/${subaccountCode}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${paystackSecretKey}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!data.status) {
            console.error('[Check Subaccount] Paystack error:', data);
            return new Response(
                JSON.stringify({
                    error: data.message || 'Failed to fetch subaccount details',
                    details: data
                }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        const subaccountData = data.data;
        console.log(`[Check Subaccount] Successfully fetched: ${subaccountData.business_name}`);

        return new Response(
            JSON.stringify({
                success: true,
                subaccount: {
                    subaccount_code: subaccountData.subaccount_code,
                    business_name: subaccountData.business_name,
                    percentage_charge: subaccountData.percentage_charge,
                    settlement_bank: subaccountData.settlement_bank,
                    account_number: subaccountData.account_number,
                    is_verified: subaccountData.is_verified,
                    active: subaccountData.active,
                    description: subaccountData.description,
                    primary_contact_email: subaccountData.primary_contact_email,
                    created_at: subaccountData.createdAt,
                    updated_at: subaccountData.updatedAt
                }
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('[Check Subaccount] Unexpected error:', error);
        return new Response(
            JSON.stringify({
                error: 'Failed to check subaccount',
                details: error.message
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
