/**
 * Paystack Webhook Handler for ZiroPay Form Payments
 * Processes payment confirmations and credits merchant wallets
 */

import { corsHeaders, handleError, successResponse, ZiroPayError } from '../_shared/errors.ts';
import { createSupabaseClient, updateWalletBalance, createTransaction } from '../_shared/db.ts';
import { PaystackService } from '../_shared/paystack.ts';

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const paystack = new PaystackService();
    
    // Verify Paystack signature
    const signature = req.headers.get('x-paystack-signature');
    const body = await req.text();
    
    if (!signature) {
      throw new ZiroPayError('INVALID_SIGNATURE', 'Missing webhook signature', 401);
    }
    
    // Note: Paystack uses HMAC SHA512 for webhook signatures
    const hash = await crypto.subtle.digest(
      'SHA-512',
      new TextEncoder().encode(Deno.env.get('PAYSTACK_SECRET_KEY') + body)
    );
    const hashArray = Array.from(new Uint8Array(hash));
    const computedSignature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    if (computedSignature !== signature) {
      console.error('[webhook] Invalid signature');
      throw new ZiroPayError('INVALID_SIGNATURE', 'Invalid webhook signature', 401);
    }
    
    const event = JSON.parse(body);
    const supabase = createSupabaseClient();
    
    console.log(`[webhook] Event received: ${event.event}`);
    
    // Handle charge success
    if (event.event === 'charge.success') {
      const reference = event.data.reference;
      const amount = event.data.amount; // In pesewas
      
      console.log(`[webhook] Processing successful payment: ${reference}, amount: ${amount} pesewas`);
      
      // Verify transaction with Paystack
      const verification = await paystack.verifyTransaction(reference);
      
      if (verification.status !== 'success') {
        throw new ZiroPayError('PAYMENT_FAILED', 'Payment verification failed', 400);
      }
      
      // Get form submission
      const { data: submission, error: submissionError } = await supabase
        .from('form_submissions')
        .select('*, payment_forms(user_id)')
        .eq('id', reference)
        .single();
      
      if (submissionError || !submission) {
        console.error('[webhook] Submission not found:', reference);
        throw new ZiroPayError('NOT_FOUND', 'Form submission not found', 404);
      }
      
      // Update submission status
      const { error: updateError } = await supabase
        .from('form_submissions')
        .update({
          status: 'paid',
          transaction_id: reference,
          metadata: { paystack_data: verification }
        })
        .eq('id', reference);
      
      if (updateError) {
        console.error('[webhook] Failed to update submission:', updateError);
        throw new ZiroPayError('DATABASE_ERROR', 'Failed to update submission', 500);
      }
      
      // Get merchant details and user info
      const merchantUserId = submission.payment_forms.user_id;
      const payerEmail = submission.payer_email;
      const payerName = submission.payer_name;
      const formTitle = submission.payment_forms.title || 'Payment Form';
      
      // Get merchant
      const { data: merchant, error: merchantError } = await supabase
        .from('merchants')
        .select('*')
        .eq('user_id', merchantUserId)
        .eq('is_active', true)
        .single();

      if (merchantError || !merchant) {
        console.error('[webhook] Merchant not found:', merchantError);
        throw new ZiroPayError('NOT_FOUND', 'Merchant not found', 404);
      }

      console.log(`[webhook] Creating settlement record for merchant: ${merchant.id}`);

      // Create settlement record (pending)
      const { data: settlement, error: settlementError } = await supabase
        .from('settlements')
        .insert({
          merchant_id: merchant.id,
          amount: amount,
          settlement_type: merchant.settlement_type,
          settlement_account: merchant.settlement_account,
          status: 'pending',
          metadata: {
            form_id: submission.form_id,
            submission_id: submission.id,
            payment_reference: reference,
            payer_email: payerEmail,
            payer_name: payerName,
          },
        })
        .select()
        .single();

      if (settlementError) {
        console.error('[webhook] Failed to create settlement:', settlementError);
        throw new ZiroPayError('DATABASE_ERROR', 'Failed to create settlement record', 500);
      }

      console.log(`[webhook] Settlement record created: ${settlement.id}`);

      // Create transaction record for reporting (no balance change)
      await createTransaction({
        user_id: merchantUserId,
        transaction_type: 'payment_received',
        amount: amount,
        currency: 'GHS',
        status: 'completed',
        description: `Payment from ${payerEmail || 'customer'} via ${formTitle} - Pending settlement`,
        metadata: {
          form_id: submission.form_id,
          submission_id: submission.id,
          payer_email: payerEmail,
          payer_name: payerName,
          payment_reference: reference,
          paystack_reference: reference,
          settlement_id: settlement.id,
        },
      });
      
      // Send receipt email
      try {
        await supabase.functions.invoke('send-notification', {
          body: {
            type: 'payment_success',
            user_id: merchantUserId,
            data: {
              amount: amount / 100, // Convert to GHS
              reference: reference,
              payer_name: submission.payer_name,
              payer_email: submission.payer_email
            }
          }
        });
      } catch (emailError) {
        console.error('[webhook] Failed to send notification:', emailError);
        // Don't fail the webhook if email fails
      }
      
      console.log(`[webhook] Payment processed successfully: ${reference}`);
    }
    
    // Handle charge failure
    if (event.event === 'charge.failed') {
      const reference = event.data.reference;
      
      console.log(`[webhook] Payment failed: ${reference}`);
      
      // Update submission status
      await supabase
        .from('form_submissions')
        .update({
          status: 'failed',
          metadata: { paystack_data: event.data }
        })
        .eq('id', reference);
    }
    
    return successResponse({ received: true });
    
  } catch (error) {
    return handleError(error, 'form-payment-webhook');
  }
});
