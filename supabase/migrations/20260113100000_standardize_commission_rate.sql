-- Standardize Commission Rate to 1%
-- This migration updates the default commission rate for new merchants and 
-- normalizes all existing merchants to the new 1% (0.01) rate.

-- 1. Update the default value for new merchants
ALTER TABLE public.merchants 
ALTER COLUMN commission_rate SET DEFAULT 0.0100;

-- 2. Update all existing merchants to the new 1% rate
UPDATE public.merchants 
SET commission_rate = 0.0100;

-- 3. Verify the change (optional logging in migration)
-- SELECT count(*) FROM public.merchants WHERE commission_rate = 0.0100;
