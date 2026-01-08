-- Reset all merchant subaccount codes to force re-setup
-- This allows merchants to re-run the onboarding process with the fixed edge function

-- First, let's see what we're about to update
SELECT id, user_id, paystack_subaccount_code, verification_status 
FROM merchants 
WHERE paystack_subaccount_code IS NOT NULL;

-- Now reset them
UPDATE merchants
SET 
  paystack_subaccount_code = NULL,
  verification_status = 'pending'
WHERE paystack_subaccount_code IS NOT NULL;

-- Verify the update
SELECT id, user_id, paystack_subaccount_code, verification_status 
FROM merchants;

-- Note: paystack_subaccount_code_v2 will be NULL anyway since the column doesn't exist yet
-- Once the column is added, this script can be updated to clear it as well
