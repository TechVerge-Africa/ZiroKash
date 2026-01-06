-- Enable pgcrypto for hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Idempotent column handling for profiles
DO $$ 
BEGIN 
    -- 1. Rename pin_code to pin_hash if pin_code exists and pin_hash doesn't
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'pin_code') 
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'pin_hash') THEN
        ALTER TABLE public.profiles RENAME COLUMN pin_code TO pin_hash;
    END IF;

    -- 2. Add pin_hash if it still doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'pin_hash') THEN
        ALTER TABLE public.profiles ADD COLUMN pin_hash TEXT;
    END IF;

    -- 3. Add pin_setup_completed if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'pin_setup_completed') THEN
        ALTER TABLE public.profiles ADD COLUMN pin_setup_completed BOOLEAN DEFAULT FALSE;
    END IF;

    -- 4. Add avatar_url if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'avatar_url') THEN
        ALTER TABLE public.profiles ADD COLUMN avatar_url TEXT;
    END IF;
END $$;

-- Enable Storage (if not already enabled)
-- Note: Buckets and policies are often managed via the dashboard, but we can try to automate it here.
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for Avatars
-- 1. Anyone can view avatars
DROP POLICY IF EXISTS "Avatar Public Access" ON storage.objects;
CREATE POLICY "Avatar Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

-- 2. Authenticated users can upload their own avatars
DROP POLICY IF EXISTS "Users can upload own avatars" ON storage.objects;
CREATE POLICY "Users can upload own avatars" ON storage.objects FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. Users can update their own avatars
DROP POLICY IF EXISTS "Users can update own avatars" ON storage.objects;
CREATE POLICY "Users can update own avatars" ON storage.objects FOR UPDATE USING (
    auth.role() = 'authenticated' AND bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Users can delete their own avatars
DROP POLICY IF EXISTS "Users can delete own avatars" ON storage.objects;
CREATE POLICY "Users can delete own avatars" ON storage.objects FOR DELETE USING (
    auth.role() = 'authenticated' AND bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Reset PIN status as old plain-text PINs are now invalid hashes
UPDATE public.profiles SET pin_hash = NULL, pin_setup_completed = FALSE;

-- Function to set user PIN (hashing it first)
CREATE OR REPLACE FUNCTION public.set_user_pin(p_pin TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  -- Validate PIN (should be exactly 4 digits)
  IF p_pin !~ '^\d{4}$' THEN
    RAISE EXCEPTION 'PIN must be exactly 4 digits';
  END IF;

  UPDATE public.profiles
  SET 
    pin_hash = crypt(p_pin, gen_salt('bf', 8)),
    pin_setup_completed = TRUE,
    updated_at = now()
  WHERE user_id = auth.uid();
END;
$$;

-- Function to verify user PIN
CREATE OR REPLACE FUNCTION public.verify_user_pin(p_pin TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_hash TEXT;
BEGIN
  SELECT pin_hash INTO v_hash
  FROM public.profiles
  WHERE user_id = auth.uid();

  IF v_hash IS NULL THEN
    RETURN FALSE;
  END IF;

  RETURN v_hash = crypt(p_pin, v_hash);
END;
$$;

-- Harden wallets RLS: Prevent client-side updates/inserts
DROP POLICY IF EXISTS "Users can update own wallets" ON public.wallets;
DROP POLICY IF EXISTS "Users can insert own wallets" ON public.wallets;

-- Re-add SELECT policy just in case it was dropped (though we only want to drop mutation)
-- Current SELECT policy: "Users can view own wallets" ON public.wallets FOR SELECT USING (auth.uid() = user_id);

-- Note: We do NOT add back UPDATE or INSERT for authenticated users.
-- All modifications must go through RPCs like increment_wallet_balance or set_wallet_balance
-- which are defined with SECURITY DEFINER.
