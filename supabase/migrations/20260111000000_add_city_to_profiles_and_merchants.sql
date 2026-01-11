-- Add city, state, zip_code to profiles if not exists
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS zip_code TEXT;

-- Add city, state, zip_code to merchants if not exists
ALTER TABLE public.merchants 
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS zip_code TEXT;
