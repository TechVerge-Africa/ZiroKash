-- Expand notification_preferences table with more granular controls
ALTER TABLE public.notification_preferences 
ADD COLUMN IF NOT EXISTS push_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS payment_confirmations_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS deposit_alerts_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS low_balance_alerts_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS special_offers_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS newsletter_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS whatsapp_enabled BOOLEAN DEFAULT false;

-- Add comment to explain columns
COMMENT ON COLUMN public.notification_preferences.push_enabled IS 'Account notifications via browser/app';
COMMENT ON COLUMN public.notification_preferences.payment_confirmations_enabled IS 'Transaction-related notifications for payments made';
COMMENT ON COLUMN public.notification_preferences.deposit_alerts_enabled IS 'Notification when money is received';
COMMENT ON COLUMN public.notification_preferences.low_balance_alerts_enabled IS 'Alert when wallet balance drops below threshold';
COMMENT ON COLUMN public.notification_preferences.special_offers_enabled IS 'Marketing and promotional alerts';
COMMENT ON COLUMN public.notification_preferences.newsletter_enabled IS 'Monthly product updates';
COMMENT ON COLUMN public.notification_preferences.whatsapp_enabled IS 'Receive updates via WhatsApp';
