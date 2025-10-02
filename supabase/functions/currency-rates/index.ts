const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Exchange rates (base: USD)
// In production, fetch from API like exchangerate-api.com
const EXCHANGE_RATES: Record<string, number> = {
  'USD': 1,
  'GHS': 15.50,    // Ghana Cedi
  'NGN': 1650,     // Nigerian Naira
  'KES': 129,      // Kenyan Shilling
  'UGX': 3700,     // Ugandan Shilling
  'TZS': 2500,     // Tanzanian Shilling
  'ZAR': 18.50,    // South African Rand
  'GBP': 0.79,     // British Pound
  'EUR': 0.92,     // Euro
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { from, to, amount } = await req.json();

    if (!from || !to) {
      throw new Error('From and to currencies are required');
    }

    const fromRate = EXCHANGE_RATES[from] || 1;
    const toRate = EXCHANGE_RATES[to] || 1;

    // Convert to USD first, then to target currency
    const amountInUSD = amount / fromRate;
    const convertedAmount = amountInUSD * toRate;

    return new Response(
      JSON.stringify({
        success: true,
        from,
        to,
        amount,
        converted_amount: Math.round(convertedAmount * 100) / 100,
        rate: toRate / fromRate,
        rates: EXCHANGE_RATES,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Currency conversion error:', error);
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
