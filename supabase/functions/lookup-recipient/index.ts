import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LookupRequest {
  identifier: string; // phone, email, or username
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get the session or user object
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { identifier } = await req.json() as LookupRequest;

    if (!identifier || identifier.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'Identifier is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Looking up recipient:', identifier);

    // Search user_identifiers table
    const { data: identifierData, error: lookupError } = await supabaseClient
      .from('user_identifiers')
      .select('user_id, identifier_type, identifier_value, is_verified')
      .eq('identifier_value', identifier.trim())
      .eq('is_verified', true)
      .maybeSingle();

    if (lookupError) {
      console.error('Lookup error:', lookupError);
      throw lookupError;
    }

    if (!identifierData) {
      return new Response(
        JSON.stringify({ 
          found: false,
          message: 'Recipient not found on ZiroKash'
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get user profile information
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('full_name')
      .eq('user_id', identifierData.user_id)
      .single();

    if (profileError) {
      console.error('Profile error:', profileError);
    }

    return new Response(
      JSON.stringify({
        found: true,
        recipient: {
          user_id: identifierData.user_id,
          full_name: profile?.full_name || 'ZiroKash User',
          identifier_type: identifierData.identifier_type,
          identifier_value: identifierData.identifier_value,
          is_zirokash_user: true
        }
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in lookup-recipient:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
