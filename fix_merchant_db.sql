
-- 1. Drop potential conflicting triggers
DROP TRIGGER IF EXISTS on_merchant_created ON public.merchants;
DROP TRIGGER IF EXISTS handle_new_merchant ON public.merchants;
DROP FUNCTION IF EXISTS public.handle_new_merchant();

-- 2. Force the default to be valid
ALTER TABLE public.merchants 
ALTER COLUMN verification_status SET DEFAULT 'pending'::kyc_status;

-- 3. Ensure the column type is correct (idempotent)
-- (No need to alter type if it's already enum, but helpful to visually confirm)

-- 4. Check for any other constraints that might check for 'approved'
ALTER TABLE public.merchants 
DROP CONSTRAINT IF EXISTS merchants_verification_status_check;

-- 5. Inspect for any other triggers (Optional, for manual debugging if this fails)
-- SELECT tgname FROM pg_trigger WHERE tgrelid = 'public.merchants'::regclass;
