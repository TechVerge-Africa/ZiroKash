-- Add PIN related fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS pin_code TEXT,
ADD COLUMN IF NOT EXISTS pin_setup_completed BOOLEAN DEFAULT FALSE;
