/**
 * PIN Verification Edge Function
 * Secure PIN verification with rate limiting and auto-lock
 */

import { corsHeaders, handleError, successResponse, ZiroPayError, ErrorCodes } from '../_shared/errors.ts';
import { createSupabaseClient, getAuthUser } from '../_shared/db.ts';
import { validateRequest, PinSchema } from '../_shared/validation.ts';

interface VerifyPinRequest {
  pin: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authenticated user
    const user = await getAuthUser(req);
    
    // Parse and validate request
    const body = await req.json();
    const validatedPin = validateRequest(PinSchema, body.pin);
    
    const supabase = createSupabaseClient();
    
    // Get user's PIN record
    const { data: pinRecord, error: fetchError } = await supabase
      .from('user_pins')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (fetchError || !pinRecord) {
      throw new ZiroPayError(
        ErrorCodes.VALIDATION_ERROR,
        'PIN not set up',
        400
      );
    }
    
    // Check if PIN is locked
    if (pinRecord.is_locked) {
      const lockedUntil = new Date(pinRecord.locked_until);
      const now = new Date();
      
      if (lockedUntil > now) {
        const minutesLeft = Math.ceil((lockedUntil.getTime() - now.getTime()) / 60000);
        throw new ZiroPayError(
          ErrorCodes.VALIDATION_ERROR,
          `PIN is locked. Try again in ${minutesLeft} minute(s).`,
          403
        );
      } else {
        // Unlock PIN if lock period has passed
        await supabase
          .from('user_pins')
          .update({
            is_locked: false,
            locked_until: null,
            failed_attempts: 0,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
      }
    }
    
    // Hash the provided PIN
    const encoder = new TextEncoder();
    const data = encoder.encode(validatedPin);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const provided_hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Verify PIN
    if (provided_hash !== pinRecord.pin_hash) {
      // Increment failed attempts
      const newFailedAttempts = (pinRecord.failed_attempts || 0) + 1;
      
      await supabase
        .from('user_pins')
        .update({
          failed_attempts: newFailedAttempts,
          last_failed_attempt: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
      
      const attemptsLeft = 3 - newFailedAttempts;
      
      if (attemptsLeft <= 0) {
        throw new ZiroPayError(
          ErrorCodes.VALIDATION_ERROR,
          'Incorrect PIN. Your account has been locked for 30 minutes.',
          403
        );
      }
      
      throw new ZiroPayError(
        ErrorCodes.VALIDATION_ERROR,
        `Incorrect PIN. ${attemptsLeft} attempt(s) remaining.`,
        400
      );
    }
    
    // PIN is correct - reset failed attempts
    await supabase
      .from('user_pins')
      .update({
        failed_attempts: 0,
        last_failed_attempt: null,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);
    
    console.log(`[verify-pin] PIN verified successfully for user: ${user.id}`);
    
    return successResponse({
      verified: true,
      message: 'PIN verified successfully'
    });
    
  } catch (error) {
    return handleError(error, 'verify-pin');
  }
});
