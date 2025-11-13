import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createSupabaseClient, getAuthUser } from '../_shared/db.ts';
import { SettlementAccountSchema } from '../_shared/validation.ts';
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
    const supabase = createSupabaseClient();
    const user = await getAuthUser(req);

    const body = await req.json();
    
    // Validate settlement account
    const settlementAccount = SettlementAccountSchema.parse(body.settlement_account);

    // Update merchant's settlement account
    const { data: merchant, error } = await supabase
      .from('merchants')
      .update({
        settlement_type: body.settlement_type,
        settlement_account: settlementAccount,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update settlement account: ${error.message}`);
    }

    console.log('Settlement account updated for merchant:', merchant.id);

    return new Response(
      JSON.stringify({
        message: 'Settlement account updated successfully',
        merchant,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Update settlement account error:', error);
    return handleError(error);
  }
});
