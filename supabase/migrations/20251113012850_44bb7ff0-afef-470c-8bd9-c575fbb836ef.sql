-- Simplify development: disable RLS on key tables (temporary)
ALTER TABLE public.merchants DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_forms DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlements DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_api_keys DISABLE ROW LEVEL SECURITY;

-- Ensure default remains verified for clarity
ALTER TABLE public.merchants ALTER COLUMN verification_status SET DEFAULT 'verified'::kyc_status;