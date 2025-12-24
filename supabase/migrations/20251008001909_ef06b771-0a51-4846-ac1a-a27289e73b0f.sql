-- Fix critical security issue: Remove public access to user_identifiers
DROP POLICY IF EXISTS "Anyone can lookup identifiers" ON public.user_identifiers;

-- Set default currency to GHS for Ghana
ALTER TABLE public.wallets ALTER COLUMN currency SET DEFAULT 'GHS';

-- Update existing USD wallets to GHS (for Ghana market)
UPDATE public.wallets SET currency = 'GHS' WHERE currency = 'USD';

-- Add notification preferences table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own notification preferences"
ON public.notification_preferences
FOR ALL
USING (auth.uid() = user_id);

-- Add trigger to create notification preferences for new users
CREATE OR REPLACE FUNCTION public.handle_new_user_notification_prefs()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_notification_prefs
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_notification_prefs();