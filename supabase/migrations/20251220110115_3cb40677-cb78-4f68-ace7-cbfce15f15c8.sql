-- Add Paystack subaccount columns to merchants table
ALTER TABLE public.merchants 
ADD COLUMN IF NOT EXISTS paystack_subaccount_code TEXT,
ADD COLUMN IF NOT EXISTS settlement_bank_code TEXT,
ADD COLUMN IF NOT EXISTS settlement_account_number TEXT,
ADD COLUMN IF NOT EXISTS settlement_account_name TEXT;

-- Add index for faster subaccount lookups
CREATE INDEX IF NOT EXISTS idx_merchants_subaccount ON public.merchants(paystack_subaccount_code) WHERE paystack_subaccount_code IS NOT NULL;