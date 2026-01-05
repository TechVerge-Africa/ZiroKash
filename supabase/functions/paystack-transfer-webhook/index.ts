import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.177.0/crypto/mod.ts";

serve(async (req) => {
    try {
        const paystackSecret = Deno.env.get('PAYSTACK_SECRET_KEY');
        if (!paystackSecret) {
            throw new Error('PAYSTACK_SECRET_KEY not configured');
        }

        // Verify Paystack signature
        const signature = req.headers.get('x-paystack-signature');
        const body = await req.text();

        const hash = createHmac("sha512", paystackSecret)
            .update(body)
            .toString();

        if (hash !== signature) {
            console.error('[Transfer Webhook] Invalid signature');
            return new Response(
                JSON.stringify({ error: 'Invalid signature' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const event = JSON.parse(body);
        console.log(`[Transfer Webhook] Event: ${event.event}`);

        // Only handle transfer events
        if (!event.event.startsWith('transfer.')) {
            return new Response(JSON.stringify({ received: true }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        const transferData = event.data;
        const transferCode = transferData.transfer_code;
        const amount = transferData.amount / 100; // Convert from kobo
        const currency = transferData.currency || 'GHS';
        const status = event.event === 'transfer.success' ? 'success' :
            event.event === 'transfer.failed' ? 'failed' :
                event.event === 'transfer.reversed' ? 'reversed' : 'pending';

        // Get merchant by recipient account (if available in metadata)
        const recipientCode = transferData.recipient?.recipient_code;

        // Try to find merchant by account number
        const { data: merchant } = await supabase
            .from('merchants')
            .select('id')
            .eq('settlement_account_number', transferData.recipient?.details?.account_number)
            .single();

        if (!merchant) {
            console.log(`[Transfer Webhook] No merchant found for transfer ${transferCode}`);
            return new Response(JSON.stringify({ received: true }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Create or update settlement record
        const { error: settlementError } = await supabase
            .from('settlements')
            .upsert({
                merchant_id: merchant.id,
                paystack_transfer_code: transferCode,
                amount: amount,
                currency: currency,
                status: status,
                recipient_bank_code: transferData.recipient?.details?.bank_code,
                recipient_account_number: transferData.recipient?.details?.account_number,
                recipient_account_name: transferData.recipient?.details?.account_name,
                settled_at: status === 'success' ? new Date().toISOString() : null,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'paystack_transfer_code'
            });

        if (settlementError) {
            console.error('[Transfer Webhook] Error creating settlement:', settlementError);
        } else {
            console.log(`[Transfer Webhook] Settlement recorded: ${transferCode} - ${status}`);
        }

        // Sync wallet balance from Paystack when payout succeeds
        if (status === 'success') {
            try {
                const paystackKey = Deno.env.get('PAYSTACK_SECRET_KEY');
                const { data: merchantData } = await supabase
                    .from('merchants')
                    .select('paystack_subaccount_code, user_id')
                    .eq('id', merchant.id)
                    .single();

                if (merchantData?.paystack_subaccount_code) {
                    // Fetch current balance from Paystack
                    const balanceResponse = await fetch(
                        `https://api.paystack.co/balance?subaccount=${merchantData.paystack_subaccount_code}`,
                        {
                            headers: {
                                'Authorization': `Bearer ${paystackKey}`,
                                'Content-Type': 'application/json',
                            },
                        }
                    );

                    const balanceData = await balanceResponse.json();

                    if (balanceData.status) {
                        const availableBalance = (balanceData.data[0]?.balance || 0) / 100;

                        // Update merchant wallet to match Paystack balance
                        const { error: walletError } = await supabase.rpc('set_wallet_balance', {
                            _user_id: merchantData.user_id,
                            _wallet_type: 'merchant',
                            _amount: availableBalance,
                            _currency: 'GHS'
                        });

                        if (walletError) {
                            console.error('[Transfer Webhook] Wallet sync error:', walletError);
                        } else {
                            console.log(`[Transfer Webhook] Wallet synced to Paystack balance: ${availableBalance} GHS`);
                        }
                    }
                }
            } catch (error) {
                console.error('[Transfer Webhook] Error syncing balance:', error);
            }
        }

        // Invalidate balance cache to force refresh
        await supabase
            .from('paystack_balance_cache')
            .delete()
            .eq('merchant_id', merchant.id);

        console.log(`[Transfer Webhook] Balance cache invalidated for merchant ${merchant.id}`);

        return new Response(JSON.stringify({ received: true }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('[Transfer Webhook] Error:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
});
