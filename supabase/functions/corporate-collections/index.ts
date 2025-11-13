import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateCollectionRequest {
  customer_email: string;
  amount: number;
  currency?: string;
  description?: string;
  reference?: string;
  webhook_url?: string;
  expires_in_hours?: number;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname;

  // Route to different handlers
  if (path.includes('/create')) {
    return handleCreateCollection(req);
  } else if (path.includes('/webhook')) {
    return handleWebhook(req);
  } else if (path.includes('/status/')) {
    return handleGetStatus(req);
  } else {
    return new Response(
      JSON.stringify({ error: 'Invalid endpoint' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function handleCreateCollection(req: Request) {
  try {
    // Authenticate merchant using API key
    const apiKey = req.headers.get('x-api-key');
    if (!apiKey) {
      throw new Error('API key required');
    }

    // Get merchant by API key
    const { data: merchant, error: merchantError } = await supabase
      .from('merchants')
      .select('*')
      .eq('api_key', apiKey)
      .eq('is_active', true)
      .single();

    if (merchantError || !merchant) {
      throw new Error('Invalid API key or inactive merchant');
    }

    const {
      customer_email,
      amount,
      currency = 'NGN',
      description,
      reference,
      webhook_url,
      expires_in_hours = 24
    }: CreateCollectionRequest = await req.json();

    // Validate input
    if (!customer_email || !amount || amount <= 0) {
      throw new Error('Invalid collection parameters');
    }

    // Generate unique reference if not provided
    const collectionReference = reference || `COLL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const amountInCents = BigInt(Math.round(amount * 100));
    const expiresAt = new Date(Date.now() + expires_in_hours * 60 * 60 * 1000);

    // Create payment URL (this would integrate with actual payment gateway)
    const paymentUrl = `https://pay.zirokash.com/collect/${collectionReference}`;

    // Create collection record
    const { data: collection, error: collectionError } = await supabase
      .from('corporate_collections')
      .insert({
        merchant_id: merchant.id,
        customer_email,
        amount: amountInCents.toString(),
        currency,
        description: description || `Payment to ${merchant.business_name}`,
        reference: collectionReference,
        payment_url: paymentUrl,
        expires_at: expiresAt.toISOString(),
        status: 'pending'
      })
      .select()
      .single();

    if (collectionError) {
      throw new Error('Failed to create collection');
    }

    return new Response(
      JSON.stringify({
        success: true,
        collection_id: collection.id,
        reference: collectionReference,
        payment_url: paymentUrl,
        amount: amount,
        currency: currency,
        status: 'pending',
        expires_at: expiresAt.toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Create collection error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Create collection failed' }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}

async function handleWebhook(req: Request) {
  try {
    const webhookData = await req.json();
    const { reference, status, amount, transaction_id } = webhookData;

    if (!reference) {
      throw new Error('Reference is required');
    }

    // Find collection by reference
    const { data: collection, error: collectionError } = await supabase
      .from('corporate_collections')
      .select('*, merchants(*)')
      .eq('reference', reference)
      .single();

    if (collectionError || !collection) {
      throw new Error('Collection not found');
    }

    // Update collection status
    const updateData: any = {
      status: status,
      webhook_data: webhookData,
      updated_at: new Date().toISOString()
    };

    if (status === 'completed') {
      updateData.paid_at = new Date().toISOString();
    }

    const { error: updateError } = await supabase
      .from('corporate_collections')
      .update(updateData)
      .eq('id', collection.id);

    if (updateError) {
      throw new Error('Failed to update collection');
    }

    // If payment is completed, credit merchant's wallet
    if (status === 'completed') {
      const amountInCents = BigInt(collection.amount);
      const merchantCommission = BigInt(Math.round(Number(amountInCents) * Number(collection.merchants.commission_rate)));
      const netAmount = amountInCents - merchantCommission;

      // Get merchant's wallet
      const { data: merchantWallet, error: walletError } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', collection.merchants.user_id)
        .eq('wallet_type', 'main')
        .single();

      if (!walletError && merchantWallet) {
        // Credit merchant wallet
        const currentBalance = BigInt(merchantWallet.balance);
        const newBalance = (currentBalance + netAmount).toString();

        await supabase
          .from('wallets')
          .update({ balance: newBalance })
          .eq('id', merchantWallet.id);

        // Create transaction record
        await supabase
          .from('transactions')
          .insert({
            user_id: collection.merchants.user_id,
            transaction_type: 'corporate_collection',
            amount: amountInCents.toString(),
            transaction_fee: merchantCommission.toString(),
            to_wallet_id: merchantWallet.id,
            description: `Collection: ${collection.description}`,
            external_reference: transaction_id,
            status: 'completed',
            processed_at: new Date().toISOString(),
            currency: collection.currency,
            metadata: { collection_id: collection.id, reference: reference }
          });
      }

      // Send webhook to merchant if configured
      if (collection.merchants.webhook_url) {
        try {
          await fetch(collection.merchants.webhook_url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-ZiroKash-Signature': 'todo-implement-signature'
            },
            body: JSON.stringify({
              event: 'collection.completed',
              collection_id: collection.id,
              reference: reference,
              amount: Number(amountInCents) / 100,
              net_amount: Number(netAmount) / 100,
              fee: Number(merchantCommission) / 100,
              customer_email: collection.customer_email,
              timestamp: new Date().toISOString()
            })
          });
        } catch (webhookError) {
          console.error('Merchant webhook delivery failed:', webhookError);
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Webhook processing failed' }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}

async function handleGetStatus(req: Request) {
  try {
    const url = new URL(req.url);
    const reference = url.pathname.split('/').pop();

    if (!reference) {
      throw new Error('Reference is required');
    }

    // Get collection by reference
    const { data: collection, error: collectionError } = await supabase
      .from('corporate_collections')
      .select('*')
      .eq('reference', reference)
      .single();

    if (collectionError || !collection) {
      throw new Error('Collection not found');
    }

    return new Response(
      JSON.stringify({
        collection_id: collection.id,
        reference: collection.reference,
        amount: Number(collection.amount) / 100,
        currency: collection.currency,
        status: collection.status,
        customer_email: collection.customer_email,
        description: collection.description,
        payment_url: collection.payment_url,
        created_at: collection.created_at,
        expires_at: collection.expires_at,
        paid_at: collection.paid_at
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Get status error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Get status failed' }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}