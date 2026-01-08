ALTER TABLE merchants 
ADD COLUMN IF NOT EXISTS paystack_subaccount_code_v2 TEXT;

-- Create an index for faster lookups (optional but good practice)
CREATE INDEX IF NOT EXISTS idx_merchants_subaccount_v2 ON merchants(paystack_subaccount_code_v2);
