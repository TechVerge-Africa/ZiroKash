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

        // Send SMS via Twilio (with dev mode fallback)
        const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
        const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
        const twilioPhone = Deno.env.get('TWILIO_PHONE_NUMBER');

        let smsSuccess = false;
        let devMode = false;

        if (twilioAccountSid && twilioAuthToken && twilioPhone) {
          try {
            const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
            const body = new URLSearchParams({
              To: phone,
              From: twilioPhone,
              Body: `Your ZiroKash verification code is: ${otpCode}. Valid for 5 minutes.`,
            });

            const twilioResponse = await fetch(twilioUrl, {
              method: 'POST',
              headers: {
                'Authorization': 'Basic ' + btoa(`${twilioAccountSid}:${twilioAuthToken}`),
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: body.toString(),
            });

            if (twilioResponse.ok) {
              smsSuccess = true;
              console.log('OTP sent via Twilio to:', phone);
            } else {
              const errorText = await twilioResponse.text();
              console.error('Twilio error:', errorText);
              console.log('Falling back to dev mode');
              devMode = true;
            }
          } catch (error) {
            console.error('Twilio request failed:', error);
            console.log('Falling back to dev mode');
            devMode = true;
          }
        } else {
          console.log('Twilio credentials not configured, using dev mode');
          devMode = true;
        }

        const responseMessage = devMode 
          ? `OTP sent (dev mode). Your code is: ${otpCode}`
          : 'OTP sent successfully to your phone';

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: responseMessage,
            devMode 
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
        // Create auth user with phone as email substitute
        const randomEmail = `${phone.replace(/\+/g, '')}@zirokash.temp`;
        const randomPassword = crypto.randomUUID();

        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: randomEmail,
          password: randomPassword,
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

        // Hash and store PIN
        const pinEncoder = new TextEncoder();
        const pinData = pinEncoder.encode(pin);
        const pinHashBuffer = await crypto.subtle.digest('SHA-256', pinData);
        const pinHashArray = Array.from(new Uint8Array(pinHashBuffer));
        const pinHash = pinHashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        await supabase.from('user_pins').insert({
          user_id: authData.user.id,
          pin_hash: pinHash,
        });

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