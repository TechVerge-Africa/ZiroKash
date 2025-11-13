import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createSupabaseClient } from '../_shared/db.ts';
import { PaystackService } from '../_shared/paystack.ts';
import { handleError } from '../_shared/errors.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting settlement processing...');
    
    const supabase = createSupabaseClient();
    const paystack = new PaystackService();

    // Fetch all pending settlements (minimum GHS 10)
    const { data: pendingSettlements, error: fetchError } = await supabase
      .from('settlements')
      .select('*, merchants(*)')
      .eq('status', 'pending')
      .gte('amount', 1000); // Min GHS 10

    if (fetchError) {
      throw new Error(`Failed to fetch settlements: ${fetchError.message}`);
    }

    if (!pendingSettlements || pendingSettlements.length === 0) {
      console.log('No pending settlements to process');
      return new Response(
        JSON.stringify({ message: 'No pending settlements', processed: 0 }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${pendingSettlements.length} pending settlements`);

    // Group settlements by merchant
    const groupedByMerchant = pendingSettlements.reduce((acc: any, settlement: any) => {
      const merchantId = settlement.merchant_id;
      if (!acc[merchantId]) {
        acc[merchantId] = [];
      }
      acc[merchantId].push(settlement);
      return acc;
    }, {});

    let processedCount = 0;
    let failedCount = 0;

    // Process each merchant's settlements
    for (const [merchantId, settlements] of Object.entries(groupedByMerchant) as any) {
      try {
        const totalAmount = settlements.reduce((sum: number, s: any) => sum + s.amount, 0);
        const merchant = settlements[0].merchants;
        const reference = `SETTLE_${Date.now()}_${merchantId}`;

        console.log(`Processing settlement for merchant ${merchantId}: GHS ${totalAmount / 100}`);

        // Update settlements to processing
        const settlementIds = settlements.map((s: any) => s.id);
        await supabase
          .from('settlements')
          .update({ 
            status: 'processing',
            paystack_reference: reference,
          })
          .in('id', settlementIds);

        // Initiate Paystack transfer based on settlement type
        if (merchant.settlement_type === 'momo') {
          await paystack.transferToMobileMoney({
            amount: totalAmount,
            recipient: merchant.settlement_account.phone,
            provider: merchant.settlement_account.provider,
            reference: reference,
            reason: `Settlement for ${merchant.business_name}`,
          });
        } else if (merchant.settlement_type === 'bank') {
          await paystack.transferToBank({
            amount: totalAmount,
            account_number: merchant.settlement_account.account_number,
            bank_code: merchant.settlement_account.bank_code || 'GCB',
            reference: reference,
            reason: `Settlement for ${merchant.business_name}`,
          });
        }

        processedCount += settlements.length;
        console.log(`Successfully initiated settlement for merchant ${merchantId}`);

        // Send notification
        await supabase.functions.invoke('send-notification', {
          body: {
            type: 'settlement_initiated',
            to: merchant.business_email,
            data: {
              merchant_name: merchant.business_name,
              amount: totalAmount,
              reference: reference,
              settlement_type: merchant.settlement_type,
            },
          },
        });

      } catch (error: any) {
        console.error(`Failed to process settlement for merchant ${merchantId}:`, error);
        
        // Mark settlements as failed
        const settlementIds = (settlements as any).map((s: any) => s.id);
        await supabase
          .from('settlements')
          .update({ 
            status: 'failed',
            error_message: error.message,
          })
          .in('id', settlementIds);

        failedCount += (settlements as any).length;
      }
    }

    console.log(`Settlement processing complete. Processed: ${processedCount}, Failed: ${failedCount}`);

    return new Response(
      JSON.stringify({
        message: 'Settlement processing complete',
        processed: processedCount,
        failed: failedCount,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Settlement processing error:', error);
    return handleError(error);
  }
});
