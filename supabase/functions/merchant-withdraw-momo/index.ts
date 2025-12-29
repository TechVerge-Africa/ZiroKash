import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WithdrawRequest {
    amount: number;
    phone_number: string;
    provider: 'MTN' | 'VOD' | 'ATL';
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            throw new Error('Authorization required');
        }

        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: authHeader } } }
        );

        const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
        if (authError || !user) {
            throw new Error('Unauthorized');
        }

        const { amount, phone_number, provider }: WithdrawRequest = await req.json();

        // Validation
        if (!amount || amount <= 0) {
            throw new Error('Invalid amount');
        }
        if (!phone_number) {
            throw new Error('Phone number required');
        }
        if (!provider || !['MTN', 'VOD', 'ATL'].includes(provider)) {
            throw new Error('Invalid mobile money provider');
        }

        console.log(`[Merchant Withdraw MoMo] Processing withdrawal for user ${user.id}`);

        // Get merchant record
        const { data: merchant, error: merchantError } = await supabaseClient
            .from('merchants')
            .select('id, business_name, paystack_subaccount_code')
            .eq('user_id', user.id)
            .single();

        if (merchantError || !merchant) {
            throw new Error('Merchant account not found. Please complete merchant onboarding first.');
        }

        // Calculate available balance
        // Total earnings from paid submissions
        const { data: submissions } = await supabaseClient
            .from('form_submissions')
            .select('amount, form_id')
            .eq('status', 'paid')
            .in('form_id',
                supabaseClient
                    .from('payment_forms')
                    .select('id')
                    .eq('user_id', user.id)
            );

        const totalEarned = submissions?.reduce((sum, s) => sum + (s.amount || 0), 0) || 0;

        // Total already withdrawn
        const { data: withdrawals } = await supabaseClient
            .from('merchant_withdrawals')
            .select('amount')
            .eq('merchant_id', merchant.id)
            .in('status', ['completed', 'processing']);

        const totalWithdrawn = withdrawals?.reduce((sum, w) => sum + w.amount, 0) || 0;

        // Available balance (in pesewas)
        const availableBalance = totalEarned - totalWithdrawn;
        const amountInPesewas = Math.round(amount * 100);

        console.log(`[Merchant Withdraw MoMo] Balance check: earned=${totalEarned}, withdrawn=${totalWithdrawn}, available=${availableBalance}, requested=${amountInPesewas}`);

        // Check if merchant has sufficient balance (allow 80% of earned to prevent issues)
        const maxWithdrawable = Math.floor(totalEarned * 0.8);
        if (amountInPesewas > maxWithdrawable) {
            throw new Error(`Insufficient balance. Maximum withdrawable: GHS ${(maxWithdrawable / 100).toFixed(2)}`);
        }

        if (amountInPesewas > availableBalance) {
            throw new Error(`Insufficient available balance. Available: GHS ${(availableBalance / 100).toFixed(2)}`);
        }

        // Create withdrawal record
        const { data: withdrawal, error: withdrawalError } = await supabaseClient
            .from('merchant_withdrawals')
            .insert({
                merchant_id: merchant.id,
                amount: amountInPesewas,
                withdrawal_method: 'momo',
                phone_number: phone_number,
                provider: provider,
                status: 'pending',
            })
            .select()
            .single();

        if (withdrawalError) {
            console.error('[Merchant Withdraw MoMo] Failed to create withdrawal record:', withdrawalError);
            throw new Error('Failed to create withdrawal request');
        }

        console.log(`[Merchant Withdraw MoMo] Created withdrawal record: ${withdrawal.id}`);

        // Process transfer via Paystack
        const paystackKey = Deno.env.get('PAYSTACK_SECRET_KEY');
        if (!paystackKey) {
            throw new Error('Payment provider not configured');
        }

        // Create transfer recipient
        const recipientResponse = await fetch('https://api.paystack.co/transferrecipient', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${paystackKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'mobile_money',
                name: merchant.business_name || 'Merchant',
                account_number: phone_number,
                bank_code: provider,
                currency: 'GHS',
                metadata: {
                    merchant_id: merchant.id,
                    user_id: user.id,
                    withdrawal_id: withdrawal.id,
                },
            }),
        });

        const recipientData = await recipientResponse.json();

        if (!recipientData.status) {
            // Update withdrawal to failed
            await supabaseClient
                .from('merchant_withdrawals')
                .update({
                    status: 'failed',
                    error_message: recipientData.message
                })
                .eq('id', withdrawal.id);

            throw new Error(recipientData.message || 'Failed to create transfer recipient');
        }

        console.log(`[Merchant Withdraw MoMo] Created recipient: ${recipientData.data.recipient_code}`);

        // Initiate transfer
        const transferResponse = await fetch('https://api.paystack.co/transfer', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${paystackKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                source: 'balance',
                amount: amountInPesewas,
                recipient: recipientData.data.recipient_code,
                reason: `Merchant withdrawal - ${withdrawal.id}`,
                reference: withdrawal.id,
            }),
        });

        const transferData = await transferResponse.json();

        if (!transferData.status) {
            // Update withdrawal to failed
            await supabaseClient
                .from('merchant_withdrawals')
                .update({
                    status: 'failed',
                    error_message: transferData.message
                })
                .eq('id', withdrawal.id);

            throw new Error(transferData.message || 'Transfer initiation failed');
        }

        // Update withdrawal to processing
        await supabaseClient
            .from('merchant_withdrawals')
            .update({
                status: 'processing',
                paystack_reference: transferData.data.transfer_code,
                metadata: {
                    recipient_code: recipientData.data.recipient_code,
                    transfer_data: transferData.data,
                },
            })
            .eq('id', withdrawal.id);

        console.log(`[Merchant Withdraw MoMo] Transfer initiated: ${transferData.data.transfer_code}`);

        return new Response(
            JSON.stringify({
                success: true,
                withdrawal_id: withdrawal.id,
                reference: transferData.data.transfer_code,
                amount: amount,
                status: 'processing',
                message: 'Withdrawal is being processed. Funds will arrive shortly.',
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('[Merchant Withdraw MoMo] Error:', error);
        return new Response(
            JSON.stringify({
                success: false,
                error: error.message,
            }),
            {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
        );
    }
});
