-- Force Reset All Merchant Subaccounts
-- This query will clear the subaccount codes and set verification status to pending
-- so that all merchants are forced to go through the onboarding process again.

UPDATE merchants
SET 
  paystack_subaccount_code = NULL,
  verification_status = 'pending'
WHERE paystack_subaccount_code IS NOT NULL;

-- Verify the result
SELECT count(*) as reset_count FROM merchants WHERE verification_status = 'pending';
