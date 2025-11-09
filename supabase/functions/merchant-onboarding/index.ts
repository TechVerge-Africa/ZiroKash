/**
 * Merchant Onboarding Edge Function
 * Simplified 2-step merchant registration with auto-approval
 */

import { corsHeaders, handleError, successResponse, ZiroPayError, ErrorCodes } from '../_shared/errors.ts';
import { createSupabaseClient, getAuthUser, checkRateLimit } from '../_shared/db.ts';
import { validateRequest, MerchantOnboardingSchema, PinSchema } from '../_shared/validation.ts';

interface OnboardingRequest {
  business_name: string;
  business_email: string;
  business_phone: string;
  contact_person: string;
  merchant_type: 'school' | 'church' | 'ngo' | 'association' | 'business' | 'other';
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
    
    // Check rate limit (10 requests per hour)
    await checkRateLimit(user.id, 'merchant-onboarding', 10, 60);
    
    // Parse and validate request
    const body = await req.json();
    const { pin, ...merchantData } = body as OnboardingRequest;
    
    // Validate merchant data
    const validatedData = validateRequest(MerchantOnboardingSchema, merchantData);
    
    // Validate PIN
    const validatedPin = validateRequest(PinSchema, pin);
    
    const supabase = createSupabaseClient();
    
    // Check if merchant already exists
    const { data: existingMerchant } = await supabase
      .from('merchants')
      .select('id')
      .eq('user_id', user.id)
      .single();
    
    if (existingMerchant) {
      throw new ZiroPayError(
        ErrorCodes.VALIDATION_ERROR,
        'Merchant account already exists',
        400
      );
    }
    
    // Hash PIN using SHA-256
    const encoder = new TextEncoder();
    const data = encoder.encode(validatedPin);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const pin_hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Create merchant account with AUTO-APPROVAL
    const { data: merchant, error: merchantError } = await supabase
      .from('merchants')
      .insert({
        user_id: user.id,
        business_name: validatedData.business_name,
        business_email: validatedData.business_email,
        business_phone: validatedData.business_phone,
        contact_person: validatedData.contact_person,
        merchant_type: validatedData.merchant_type,
        verification_status: 'approved', // Auto-approve for Ghana
        is_active: true,
        requires_review: true, // Flag for later compliance review
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (merchantError) {
      throw new ZiroPayError(
        ErrorCodes.DATABASE_ERROR,
        'Failed to create merchant account',
        500,
        merchantError
      );
    }
    
    // Create or update PIN
    const { error: pinError } = await supabase
      .from('user_pins')
      .upsert({
        user_id: user.id,
        pin_hash,
        failed_attempts: 0,
        is_locked: false,
        locked_until: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (pinError) {
      // Rollback merchant creation
      await supabase
        .from('merchants')
        .delete()
        .eq('id', merchant.id);
      
      throw new ZiroPayError(
        ErrorCodes.DATABASE_ERROR,
        'Failed to set up PIN',
        500,
        pinError
      );
    }
    
    // Send approval notification email
    try {
      await supabase.functions.invoke('send-notification', {
        body: {
          type: 'merchant_approved',
          user_id: user.id,
          merchant_id: merchant.id,
          data: {
            business_name: validatedData.business_name,
            merchant_type: validatedData.merchant_type
          }
        }
      });
    } catch (emailError) {
      console.error('Failed to send notification:', emailError);
      // Don't fail the request if email fails
    }
    
    console.log(`[merchant-onboarding] Merchant created and auto-approved: ${merchant.id}`);
    
    return successResponse({
      merchant_id: merchant.id,
      business_name: merchant.business_name,
      verification_status: merchant.verification_status,
      message: 'Merchant account created successfully! You can now start accepting payments.'
    }, 201);
    
  } catch (error) {
    return handleError(error, 'merchant-onboarding');
  }
});
