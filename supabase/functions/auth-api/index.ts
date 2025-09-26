import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
}

interface LoginRequest {
  email: string;
  password: string;
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
  if (path.includes('/register')) {
    return handleRegister(req);
  } else if (path.includes('/login')) {
    return handleLogin(req);
  } else if (path.includes('/me')) {
    return handleGetUser(req);
  } else if (path.includes('/logout')) {
    return handleLogout(req);
  } else {
    return new Response(
      JSON.stringify({ error: 'Invalid endpoint' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function handleRegister(req: Request) {
  try {
    const { email, password, full_name, phone }: RegisterRequest = await req.json();

    // Validate input
    if (!email || !password || !full_name) {
      throw new Error('Email, password, and full name are required');
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        full_name,
        phone
      },
      email_confirm: false // For demo purposes, skip email confirmation
    });

    if (error) {
      throw new Error(error.message);
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.user_metadata.full_name,
          created_at: data.user.created_at
        },
        message: 'User registered successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Registration failed' }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}

async function handleLogin(req: Request) {
  try {
    const { email, password }: LoginRequest = await req.json();

    // Validate input
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw new Error(error.message);
    }

    // Get user profile and roles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', data.user.id)
      .single();

    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', data.user.id);

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          full_name: profile?.full_name || data.user.user_metadata.full_name,
          phone: profile?.phone || data.user.user_metadata.phone,
          kyc_status: profile?.kyc_status || 'pending',
          verification_level: profile?.verification_level || 1,
          roles: roles?.map(r => r.role) || ['user']
        },
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at
        },
        message: 'Login successful'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Login failed' }),
      { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}

async function handleGetUser(req: Request) {
  try {
    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid or expired token');
    }

    // Get user profile and roles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    // Get wallet balances
    const { data: wallets, error: walletsError } = await supabase
      .from('wallets')
      .select('wallet_type, balance, currency')
      .eq('user_id', user.id);

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          full_name: profile?.full_name || user.user_metadata.full_name,
          phone: profile?.phone || user.user_metadata.phone,
          kyc_status: profile?.kyc_status || 'pending',
          verification_level: profile?.verification_level || 1,
          roles: roles?.map(r => r.role) || ['user'],
          wallets: wallets?.map(w => ({
            type: w.wallet_type,
            balance: Number(w.balance) / 100, // Convert from cents
            currency: w.currency
          })) || []
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Get user error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to get user' }),
      { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}

async function handleLogout(req: Request) {
  try {
    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Sign out user
    const { error } = await supabase.auth.admin.signOut(
      authHeader.replace('Bearer ', '')
    );

    if (error) {
      throw new Error(error.message);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Logout successful'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Logout error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Logout failed' }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}