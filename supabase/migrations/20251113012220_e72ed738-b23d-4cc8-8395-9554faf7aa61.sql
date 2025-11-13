-- Drop unused tables
DROP TABLE IF EXISTS api_rate_limits CASCADE;
DROP TABLE IF EXISTS fraud_alerts CASCADE;
DROP TABLE IF EXISTS phone_otps CASCADE;
DROP TABLE IF EXISTS user_identifiers CASCADE;
DROP TABLE IF EXISTS user_pins CASCADE;
DROP TABLE IF EXISTS payment_methods CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS wallets CASCADE;
DROP TABLE IF EXISTS corporate_collections CASCADE;
DROP TABLE IF EXISTS notification_preferences CASCADE;

-- Simplify merchants table - remove complex fields
ALTER TABLE merchants DROP COLUMN IF EXISTS requires_review CASCADE;
ALTER TABLE merchants DROP COLUMN IF EXISTS min_settlement_amount CASCADE;
ALTER TABLE merchants DROP COLUMN IF EXISTS settlement_frequency CASCADE;

-- Make merchant onboarding super simple - just business info
ALTER TABLE merchants ALTER COLUMN verification_status SET DEFAULT 'verified';
ALTER TABLE merchants ALTER COLUMN is_active SET DEFAULT true;

-- Simplify profiles table
ALTER TABLE profiles DROP COLUMN IF EXISTS phone_verified CASCADE;
ALTER TABLE profiles DROP COLUMN IF EXISTS verification_level CASCADE;
ALTER TABLE profiles DROP COLUMN IF EXISTS kyc_documents CASCADE;
ALTER TABLE profiles DROP COLUMN IF EXISTS kyc_status CASCADE;
ALTER TABLE profiles DROP COLUMN IF EXISTS wallet_address CASCADE;

-- Drop unused functions
DROP FUNCTION IF EXISTS check_pin_attempts CASCADE;
DROP FUNCTION IF EXISTS check_rate_limit CASCADE;
DROP FUNCTION IF EXISTS update_user_pins_updated_at CASCADE;
DROP FUNCTION IF EXISTS cleanup_expired_otps CASCADE;
DROP FUNCTION IF EXISTS handle_new_user_notification_prefs CASCADE;

-- Temporarily disable RLS for dev simplicity (ONLY FOR DEVELOPMENT)
ALTER TABLE merchants DISABLE ROW LEVEL SECURITY;
ALTER TABLE payment_forms DISABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE settlements DISABLE ROW LEVEL SECURITY;
ALTER TABLE form_api_keys DISABLE ROW LEVEL SECURITY;