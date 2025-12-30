-- Fix verification_status enum issue in merchants table
-- The database may have a DEFAULT 'approved' which is not valid

-- First, check if there's a bad default and change it
ALTER TABLE public.merchants 
  ALTER COLUMN verification_status SET DEFAULT 'pending'::kyc_status;

-- Update any existing rows that might have invalid values
-- (This will fail if there are any, but that's okay - we'll handle it)
UPDATE public.merchants 
SET verification_status = 'pending'::kyc_status 
WHERE verification_status IS NULL 
   OR verification_status::text NOT IN ('pending', 'verified', 'rejected');
