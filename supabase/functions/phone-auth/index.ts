import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.177.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, phone, otp, pin } = await req.json();

    // Clean up expired OTPs
    await supabase.rpc('cleanup_expired_otps');

    switch (action) {
      case 'send-otp': {
        // Generate 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Hash OTP before storing
        const encoder = new TextEncoder();
        const data = encoder.encode(otpCode);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const otpHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        // Store OTP hash with 5-minute expiry
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
        
        await supabase.from('phone_otps').insert({
          phone,
          otp_hash: otpHash,
          expires_at: expiresAt,
        });

        // Send SMS via AfricasTalking
        const atUsername = Deno.env.get('AFRICAS_TALKING_USERNAME');
        const atApiKey = Deno.env.get('AFRICAS_TALKING_API_KEY');

        if (!atUsername || !atApiKey) {
          throw new Error('SMS service not configured');
        }

        const atUrl = 'https://api.africastalking.com/version1/messaging';
        const body = new URLSearchParams({
          username: atUsername,
          to: phone,
          message: `Your ZiroKash verification code is: ${otpCode}. Valid for 5 minutes. Do not share this code.`,
          from: 'ZiroKash'
        });

        const atResponse = await fetch(atUrl, {
          method: 'POST',
          headers: {
            'apiKey': atApiKey,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          body: body.toString(),
        });

        const responseData = await atResponse.json();
        
        if (!atResponse.ok || responseData.SMSMessageData?.Recipients?.[0]?.status !== 'Success') {
          console.error('AfricasTalking error:', responseData);
          throw new Error('Failed to send SMS');
        }

        console.log('OTP sent via AfricasTalking to:', phone);

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'OTP sent successfully to your phone'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      case 'verify-otp': {
        // Hash provided OTP
        const encoder = new TextEncoder();
        const data = encoder.encode(otp);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const otpHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        // Find valid OTP
        const { data: otpRecord, error: otpError } = await supabase
          .from('phone_otps')
          .select('*')
          .eq('phone', phone)
          .eq('otp_hash', otpHash)
          .eq('verified', false)
          .gt('expires_at', new Date().toISOString())
          .lt('attempts', 3)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (otpError || !otpRecord) {
          return new Response(
            JSON.stringify({ success: false, error: 'Invalid or expired OTP' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        // Mark OTP as verified
        await supabase
          .from('phone_otps')
          .update({ verified: true })
          .eq('id', otpRecord.id);

        // Check if user exists
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_id')
          .eq('phone', phone)
          .single();

        const isNewUser = !profile;

        return new Response(
          JSON.stringify({ 
            success: true, 
            isNewUser,
            userId: profile?.user_id,
            message: 'OTP verified successfully' 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      case 'create-account': {
        const { email, password } = await req.json();

        // Create auth user with email or phone-based email
        const userEmail = email || `${phone.replace(/\+/g, '')}@zirokash.temp`;

        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: userEmail,
          password: password,
          email_confirm: true,
          user_metadata: {
            phone: phone,
          }
        });

        if (authError) {
          console.error('Auth error:', authError);
          throw authError;
        }

        // Update profile with phone
        await supabase
          .from('profiles')
          .update({ 
            phone: phone,
            phone_verified: true 
          })
          .eq('user_id', authData.user.id);

        console.log('Account created for:', phone);

        return new Response(
          JSON.stringify({ 
            success: true, 
            userId: authData.user.id,
            message: 'Account created successfully' 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      case 'setup-pin': {
        const { userId } = await req.json();

        // Hash and store PIN
        const pinEncoder = new TextEncoder();
        const pinData = pinEncoder.encode(pin);
        const pinHashBuffer = await crypto.subtle.digest('SHA-256', pinData);
        const pinHashArray = Array.from(new Uint8Array(pinHashBuffer));
        const pinHash = pinHashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        await supabase.from('user_pins').upsert({
          user_id: userId,
          pin_hash: pinHash,
        });

        console.log('PIN setup for user:', userId);

        return new Response(
          JSON.stringify({ 
            success: true,
            message: 'PIN setup successfully' 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      case 'verify-pin': {
        const { userId } = await req.json();

        // Hash provided PIN
        const pinEncoder = new TextEncoder();
        const pinData = pinEncoder.encode(pin);
        const pinHashBuffer = await crypto.subtle.digest('SHA-256', pinData);
        const pinHashArray = Array.from(new Uint8Array(pinHashBuffer));
        const pinHash = pinHashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        // Get stored PIN
        const { data: pinRecord, error: pinError } = await supabase
          .from('user_pins')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (pinError || !pinRecord) {
          return new Response(
            JSON.stringify({ success: false, error: 'PIN not found' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        // Check if account is locked
        if (pinRecord.locked_until && new Date(pinRecord.locked_until) > new Date()) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Account locked. Please try again later.' 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 423 }
          );
        }

        // Verify PIN
        if (pinRecord.pin_hash !== pinHash) {
          const failedAttempts = (pinRecord.failed_attempts || 0) + 1;
          const updates: any = { failed_attempts: failedAttempts };

          // Lock account after 5 failed attempts (30 minutes)
          if (failedAttempts >= 5) {
            updates.locked_until = new Date(Date.now() + 30 * 60 * 1000).toISOString();
          }

          await supabase
            .from('user_pins')
            .update(updates)
            .eq('user_id', userId);

          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Invalid PIN',
              attemptsLeft: 5 - failedAttempts 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        // Reset failed attempts on successful login
        await supabase
          .from('user_pins')
          .update({ failed_attempts: 0, locked_until: null })
          .eq('user_id', userId);

        // Generate session token
        const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
          type: 'magiclink',
          email: `${phone.replace(/\+/g, '')}@zirokash.temp`,
        });

        if (sessionError) {
          throw sessionError;
        }

        console.log('PIN verified for user:', userId);

        return new Response(
          JSON.stringify({ 
            success: true,
            userId: userId,
            message: 'PIN verified successfully'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});