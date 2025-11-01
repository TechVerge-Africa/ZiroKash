-- Create user_pins table for secure PIN storage
CREATE TABLE IF NOT EXISTS public.user_pins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pin_hash TEXT NOT NULL,
  failed_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_pins ENABLE ROW LEVEL SECURITY;

-- Users can only access their own PIN records
CREATE POLICY "Users can manage own PINs"
  ON public.user_pins
  FOR ALL
  USING (auth.uid() = user_id);

-- Create OTP verification table
CREATE TABLE IF NOT EXISTS public.phone_otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  otp_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for OTP table
ALTER TABLE public.phone_otps ENABLE ROW LEVEL SECURITY;

-- Allow users to verify their own OTPs
CREATE POLICY "Users can verify OTPs"
  ON public.phone_otps
  FOR SELECT
  USING (TRUE);

-- Create index for faster phone lookup
CREATE INDEX IF NOT EXISTS idx_phone_otps_phone ON public.phone_otps(phone);
CREATE INDEX IF NOT EXISTS idx_phone_otps_expires ON public.phone_otps(expires_at);

-- Make phone required and unique in profiles, email optional
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE;

-- Create unique index on phone (only if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'profiles_phone_unique_idx'
  ) THEN
    CREATE UNIQUE INDEX profiles_phone_unique_idx ON public.profiles(phone) 
    WHERE phone IS NOT NULL;
  END IF;
END $$;

-- Add trigger to update updated_at on user_pins
CREATE OR REPLACE FUNCTION public.update_user_pins_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_user_pins_updated_at
  BEFORE UPDATE ON public.user_pins
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_pins_updated_at();

-- Function to clean up expired OTPs
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS void AS $$
BEGIN
  DELETE FROM public.phone_otps 
  WHERE expires_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;