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

    // Parse request body once to avoid stream consumption issues
    const requestBody = await req.json();
    const { action, phone, otp, pin, email, password, userId } = requestBody;

    // Clean up expired OTPs
    await supabase.rpc('cleanup_expired_otps');

    switch (action) {
      case 'send-otp': {
        // Validate phone number format
        if (!phone || !phone.startsWith('+')) {
          return new Response(
            JSON.stringify({ success: false, error: 'Phone number must include country code (e.g., +234...)' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

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
        
        const { error: insertError } = await supabase.from('phone_otps').insert({
          phone,
          otp_hash: otpHash,
          expires_at: expiresAt,
        });

        if (insertError) {
          console.error('Failed to store OTP:', insertError);
          throw new Error('Failed to generate verification code');
        }

        // Send SMS via AfricasTalking
        const atUsername = Deno.env.get('AFRICAS_TALKING_USERNAME');
        const atApiKey = Deno.env.get('AFRICAS_TALKING_API_KEY');

        if (!atUsername || !atApiKey) {
          console.error('AfricasTalking credentials not configured');
          throw new Error('SMS service not configured. Please contact support.');
        }

        const atUrl = 'https://api.africastalking.com/version1/messaging';
        const body = new URLSearchParams({
          username: atUsername,
          to: phone,
          message: `Your ZiroKash verification code is: ${otpCode}. Valid for 5 minutes. Do not share this code.`,
        });

        try {
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
            console.error('AfricasTalking API error:', {
              status: atResponse.status,
              response: responseData,
              phone: phone
            });
            throw new Error(`SMS delivery failed: ${responseData.SMSMessageData?.Message || 'Unknown error'}`);
          }

          console.log('OTP sent successfully via AfricasTalking to:', phone);

          return new Response(
            JSON.stringify({ 
              success: true, 
              message: 'OTP sent successfully to your phone'
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
          );
        } catch (smsError) {
          console.error('SMS sending error:', smsError);
          throw new Error('Failed to send SMS. Please check your phone number and try again.');
        }
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
          .select('user_id, phone')
          .eq('phone', phone)
          .maybeSingle();

        const isNewUser = !profile;

        // Check if user has a PIN set up
        let hasPin = false;
        if (profile?.user_id) {
          const { data: pinRecord } = await supabase
            .from('user_pins')
            .select('id')
            .eq('user_id', profile.user_id)
            .maybeSingle();
          
          hasPin = !!pinRecord;
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            isNewUser,
            hasPin,
            userId: profile?.user_id,
            message: 'OTP verified successfully' 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      case 'create-account': {
        if (!password || password.length < 6) {
          return new Response(
            JSON.stringify({ success: false, error: 'Password must be at least 6 characters' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        // Check if user already exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('user_id')
          .eq('phone', phone)
          .maybeSingle();

        if (existingProfile) {
          return new Response(
            JSON.stringify({ success: false, error: 'Account already exists. Please login instead.' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        // Create auth user with email or phone-based email
        const userEmail = email && email.includes('@') ? email : `${phone.replace(/\+/g, '')}@zirokash.temp`;

        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: userEmail,
          password: password,
          email_confirm: true,
          user_metadata: {
            phone: phone,
            has_real_email: email && email.includes('@')
          }
        });

        if (authError) {
          console.error('Auth error:', authError);
          return new Response(
            JSON.stringify({ success: false, error: authError.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        // Update profile with phone (profile created by trigger)
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            phone: phone,
            phone_verified: true 
          })
          .eq('user_id', authData.user.id);

        if (updateError) {
          console.error('Profile update error:', updateError);
        }

        console.log('Account created for:', phone, 'with email:', userEmail);

        return new Response(
          JSON.stringify({ 
            success: true, 
            userId: authData.user.id,
            email: userEmail,
            message: 'Account created successfully' 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      case 'setup-pin': {
        if (!userId) {
          return new Response(
            JSON.stringify({ success: false, error: 'User ID required' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
          return new Response(
            JSON.stringify({ success: false, error: 'PIN must be exactly 4 digits' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        // Hash and store PIN
        const pinEncoder = new TextEncoder();
        const pinData = pinEncoder.encode(pin);
        const pinHashBuffer = await crypto.subtle.digest('SHA-256', pinData);
        const pinHashArray = Array.from(new Uint8Array(pinHashBuffer));
        const pinHash = pinHashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        const { error: upsertError } = await supabase.from('user_pins').upsert({
          user_id: userId,
          pin_hash: pinHash,
          failed_attempts: 0,
          locked_until: null
        }, {
          onConflict: 'user_id'
        });

        if (upsertError) {
          console.error('PIN setup error:', upsertError);
          return new Response(
            JSON.stringify({ success: false, error: 'Failed to setup PIN' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }

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
        if (!userId || !pin) {
          return new Response(
            JSON.stringify({ success: false, error: 'User ID and PIN required' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

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
          .maybeSingle();

        if (pinError || !pinRecord) {
          return new Response(
            JSON.stringify({ success: false, error: 'PIN not set up. Please use password to login.' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        // Check if account is locked
        if (pinRecord.locked_until && new Date(pinRecord.locked_until) > new Date()) {
          const minutesLeft = Math.ceil((new Date(pinRecord.locked_until).getTime() - Date.now()) / 60000);
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: `Account locked for ${minutesLeft} more minutes. Try again later or use password.`
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
              attemptsLeft: Math.max(0, 5 - failedAttempts)
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        // Reset failed attempts on successful login
        await supabase
          .from('user_pins')
          .update({ failed_attempts: 0, locked_until: null })
          .eq('user_id', userId);

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