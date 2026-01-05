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
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        // Get authenticated user
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: authHeader } } }
        );

        const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
        if (authError || !user) {
            return new Response(
                JSON.stringify({ error: 'Authentication failed' }),
                { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Get merchant record
        const { data: merchant, error: merchantError } = await supabase
            .from('merchants')
            .select('id, paystack_subaccount_code')
            .eq('user_id', user.id)
            .single();

        if (merchantError || !merchant) {
            return new Response(
                JSON.stringify({ error: 'Merchant not found' }),
                { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        if (!merchant.paystack_subaccount_code) {
            return new Response(
                JSON.stringify({
                    error: 'No Paystack subaccount configured',
                    available_balance: 0,
                    ledger_balance: 0,
                    currency: 'GHS'
                }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Check cache first (1-hour expiry)
        const { data: cachedBalance } = await supabase
            .from('paystack_balance_cache')
            .select('*')
            .eq('merchant_id', merchant.id)
            .gt('expires_at', new Date().toISOString())
            .single();

        if (cachedBalance) {
            console.log(`[Fetch Balance] Using cached balance for merchant ${merchant.id}`);
            return new Response(
                JSON.stringify({
                    available_balance: Number(cachedBalance.available_balance),
                    ledger_balance: Number(cachedBalance.ledger_balance),
                    currency: cachedBalance.currency,
                    cached: true,
                    cached_at: cachedBalance.cached_at
                }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Fetch from Paystack API
        const paystackKey = Deno.env.get('PAYSTACK_SECRET_KEY');
        if (!paystackKey) {
            throw new Error('PAYSTACK_SECRET_KEY not configured');
        }

        console.log(`[Fetch Balance] Fetching from Paystack for subaccount: ${merchant.paystack_subaccount_code}`);

        const paystackResponse = await fetch(
            `https://api.paystack.co/balance?subaccount=${merchant.paystack_subaccount_code}`,
            {
                headers: {
                    'Authorization': `Bearer ${paystackKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const paystackData = await paystackResponse.json();

        if (!paystackData.status) {
            console.error('Paystack balance fetch failed:', paystackData);
            return new Response(
                JSON.stringify({
                    error: 'Failed to fetch balance from Paystack',
                    details: paystackData.message
                }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        const availableBalance = paystackData.data[0]?.balance || 0;
        const ledgerBalance = paystackData.data[0]?.total_balance || 0;
        const currency = paystackData.data[0]?.currency || 'GHS';

        // Convert from kobo to main currency (divide by 100)
        const availableBalanceMain = availableBalance / 100;
        const ledgerBalanceMain = ledgerBalance / 100;

        // Update cache
        await supabase
            .from('paystack_balance_cache')
            .upsert({
                merchant_id: merchant.id,
                available_balance: availableBalanceMain,
                ledger_balance: ledgerBalanceMain,
                currency: currency,
                cached_at: new Date().toISOString(),
                expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour from now
            }, {
                onConflict: 'merchant_id'
            });

        console.log(`[Fetch Balance] Balance cached for merchant ${merchant.id}: ${availableBalanceMain} ${currency}`);

        return new Response(
            JSON.stringify({
                available_balance: availableBalanceMain,
                ledger_balance: ledgerBalanceMain,
                currency: currency,
                cached: false
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Error fetching Paystack balance:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
