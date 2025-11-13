import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Map countries to currencies
const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  'GH': 'GHS', // Ghana
  'NG': 'NGN', // Nigeria
  'KE': 'KES', // Kenya
  'UG': 'UGX', // Uganda
  'TZ': 'TZS', // Tanzania
  'ZA': 'ZAR', // South Africa
  'US': 'USD', // United States
  'GB': 'GBP', // United Kingdom
  'EU': 'EUR', // Europe
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Get client IP from headers
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                     req.headers.get('x-real-ip') || 
                     'unknown';

    console.log(`Detecting country for user ${user.id} from IP ${clientIP}`);

    // Use IP geolocation API to detect country
    let countryCode = 'GH'; // Default to Ghana
    let currency = 'GHS';

    if (clientIP !== 'unknown') {
      try {
        const ipApiResponse = await fetch(`https://ipapi.co/${clientIP}/json/`);
        const ipData = await ipApiResponse.json();
        
        if (ipData.country_code) {
          countryCode = ipData.country_code;
          currency = COUNTRY_CURRENCY_MAP[countryCode] || 'GHS';
          
          console.log(`Detected country: ${countryCode}, currency: ${currency}`);
        }
      } catch (error) {
        console.error('IP detection failed, using default:', error);
      }
    }

    // Update user profile with detected country and currency
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({ 
        country_code: countryCode,
      })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Failed to update profile:', updateError);
    }

    // Update user's main wallet currency
    const { error: walletError } = await supabaseClient
      .from('wallets')
      .update({ currency })
      .eq('user_id', user.id)
      .eq('wallet_type', 'main');

    if (walletError) {
      console.error('Failed to update wallet currency:', walletError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        country_code: countryCode,
        currency: currency,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Country detection error:', error);
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
