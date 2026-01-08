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
        const { reference } = await req.json();

        if (!reference) {
            return new Response(
                JSON.stringify({ error: 'Missing reference' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        console.log(`[Verify Payment] Verifying: ${reference}`);

        // First check if it's already paid in our DB to avoid redundant API calls
        const { data: currentSub } = await supabase
            .from('form_submissions')
            .select('id, status')
            .eq('id', reference)
            .maybeSingle();

        if (currentSub?.status === 'paid') {
            console.log(`[Verify Payment] ${reference} is already marked as paid in DB.`);
            return new Response(
                JSON.stringify({ status: 'success', submission: currentSub }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Call Paystack API to verify
        const paystackKey = Deno.env.get('PAYSTACK_SECRET_KEY');
        const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                'Authorization': `Bearer ${paystackKey}`,
            }
        });

        const paystackData = await paystackResponse.json();
        console.log(`[Verify Payment] Paystack response for ${reference}:`, paystackData.status);

        if (!paystackData.status) {
            return new Response(
                JSON.stringify({ status: 'failed', message: paystackData.message }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        const { status, amount, reference: paystackRef } = paystackData.data;

        if (status === 'success') {
            console.log(`[Verify Payment] ${reference} confirmed as success by Paystack. Updating DB...`);

            // Update submission status in ZiroKash
            const { data: submission, error: updateError } = await supabase
                .from('form_submissions')
                .update({
                    status: 'paid',
                    transaction_id: paystackRef
                })
                .eq('id', reference)
                .select()
                .maybeSingle();

            if (updateError) {
                console.error('[Verify Payment] DB Update error:', updateError);
                return new Response(
                    JSON.stringify({ error: 'DB Update failed', details: updateError.message }),
                    { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                );
            }

            if (!submission) {
                console.error(`[Verify Payment] No submission found with ID ${reference} to update.`);
                // This means the reference didn't match any row in form_submissions
                return new Response(
                    JSON.stringify({ error: 'Submission record not found', reference }),
                    { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                );
            }

            // Credit wallet if not already done
            if (submission) {
                console.log(`[Verify Payment] Submission ${reference} updated to paid. Checking wallet...`);

                const { data: formData, error: formError } = await supabase
                    .from('payment_forms')
                    .select('user_id')
                    .eq('id', submission.form_id)
                    .single();

                if (formError) {
                    console.error('[Verify Payment] Error fetching form data:', formError);
                }

                if (formData) {
                    const creditAmount = submission.amount / 100;
                    console.log(`[Verify Payment] Attempting to credit ${creditAmount} GHS into wallet for user ${formData.user_id}`);

                    const { error: rpcError } = await supabase.rpc('increment_wallet_balance', {
                        _user_id: formData.user_id,
                        _wallet_type: 'merchant',
                        _amount: creditAmount,
                        _currency: 'GHS'
                    });

                    if (rpcError) {
                        console.error('[Verify Payment] Wallet credit RPC failed:', rpcError);
                        // We do NOT fail the request here, because payment IS successful.
                        // We just log it so we can fix wallet sync later or via reconciliation.
                    } else {
                        console.log(`[Verify Payment] Successfully credited ${creditAmount} GHS to merchant ${formData.user_id}`);
                    }
                }
            }

            return new Response(
                JSON.stringify({ status: 'success', submission }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({ status, message: paystackData.data.gateway_response }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('[Verify Payment] Unexpected error:', error);
        return new Response(
            JSON.stringify({ error: 'Verification failed', details: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
