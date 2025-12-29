import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const country = url.searchParams.get('country') || 'ghana';

    console.log(`Fetching banks for country: ${country}`);

    const paystackKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!paystackKey) {
      throw new Error('PAYSTACK_SECRET_KEY not configured');
    }

    const response = await fetch(`https://api.paystack.co/bank?country=${country}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${paystackKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!data.status) {
      console.error('Paystack error:', data);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch banks', details: data.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Successfully fetched ${data.data.length} banks`);

    // Remove duplicates based on bank code and sort alphabetically
    const uniqueBanks = data.data.reduce((acc: any[], bank: any) => {
      if (!acc.find(b => b.code === bank.code)) {
        acc.push(bank);
      }
      return acc;
    }, []).sort((a: any, b: any) => a.name.localeCompare(b.name));

    console.log(`Returning ${uniqueBanks.length} unique banks`);

    return new Response(
      JSON.stringify({ banks: uniqueBanks }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error fetching banks:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
