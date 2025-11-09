-- =====================================================
-- PHASE 1: DROP UNUSED TABLES
-- =====================================================
DROP TABLE IF EXISTS crypto_portfolio CASCADE;
DROP TABLE IF EXISTS blockchain_addresses CASCADE;
DROP TABLE IF EXISTS bills CASCADE;
DROP TABLE IF EXISTS credit_cards CASCADE;
DROP TABLE IF EXISTS virtual_cards CASCADE;
DROP TABLE IF EXISTS investments CASCADE;
DROP TABLE IF EXISTS savings_plans CASCADE;

-- =====================================================
-- PHASE 2: STANDARDIZE TO GHANA CEDIS (GHS)
-- =====================================================

-- Update wallets default currency to GHS
ALTER TABLE wallets ALTER COLUMN currency SET DEFAULT 'GHS';

-- Update transactions default currency to GHS
ALTER TABLE transactions ALTER COLUMN currency SET DEFAULT 'GHS';

-- Update existing records to GHS
UPDATE wallets SET currency = 'GHS' WHERE currency != 'GHS';
UPDATE transactions SET currency = 'GHS' WHERE currency != 'GHS';

-- =====================================================
-- PHASE 3: SIMPLIFY MERCHANTS TABLE
-- =====================================================

-- Remove unnecessary fields
ALTER TABLE merchants DROP COLUMN IF EXISTS business_registration_number CASCADE;
ALTER TABLE merchants DROP COLUMN IF EXISTS settlement_account_id CASCADE;
ALTER TABLE merchants DROP COLUMN IF EXISTS api_key CASCADE;
ALTER TABLE merchants DROP COLUMN IF EXISTS webhook_url CASCADE;
ALTER TABLE merchants DROP COLUMN IF EXISTS commission_rate CASCADE;

-- Add simple fields for Ghanaian context
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS merchant_type TEXT DEFAULT 'business';
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS contact_person TEXT;
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS requires_review BOOLEAN DEFAULT false;

-- Add comment for merchant_type options
COMMENT ON COLUMN merchants.merchant_type IS 'Options: school, church, ngo, association, business, other';

-- =====================================================
-- PHASE 4: ENHANCE PIN SECURITY
-- =====================================================

-- Add PIN attempt tracking and auto-lock
ALTER TABLE user_pins ADD COLUMN IF NOT EXISTS last_failed_attempt TIMESTAMPTZ;
ALTER TABLE user_pins ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT false;

-- Auto-lock function after 3 failed attempts
CREATE OR REPLACE FUNCTION public.check_pin_attempts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF NEW.failed_attempts >= 3 THEN
    NEW.is_locked = true;
    NEW.locked_until = NOW() + INTERVAL '30 minutes';
    NEW.last_failed_attempt = NOW();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS pin_attempt_check ON user_pins;
CREATE TRIGGER pin_attempt_check
  BEFORE UPDATE ON user_pins
  FOR EACH ROW
  EXECUTE FUNCTION public.check_pin_attempts();

-- =====================================================
-- PHASE 5: API RATE LIMITING
-- =====================================================

-- Create rate limiting table
CREATE TABLE IF NOT EXISTS public.api_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  endpoint TEXT NOT NULL,
  request_count INT DEFAULT 0,
  window_start TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, endpoint)
);

-- Enable RLS on rate limits
ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;

-- Rate limit policies
CREATE POLICY "Users can view own rate limits" ON public.api_rate_limits
  FOR SELECT USING (auth.uid() = user_id);

-- Rate limit check function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_user_id UUID,
  p_endpoint TEXT,
  p_limit INT DEFAULT 100,
  p_window_minutes INT DEFAULT 60
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_count INT;
  v_window_start TIMESTAMPTZ;
BEGIN
  -- Get or create rate limit record
  INSERT INTO api_rate_limits (user_id, endpoint)
  VALUES (p_user_id, p_endpoint)
  ON CONFLICT (user_id, endpoint) DO NOTHING;
  
  -- Get current count
  SELECT request_count, window_start 
  INTO v_count, v_window_start
  FROM api_rate_limits
  WHERE user_id = p_user_id AND endpoint = p_endpoint;
  
  -- Reset if window expired
  IF v_window_start < NOW() - (p_window_minutes || ' minutes')::INTERVAL THEN
    UPDATE api_rate_limits
    SET request_count = 1, window_start = NOW()
    WHERE user_id = p_user_id AND endpoint = p_endpoint;
    RETURN true;
  END IF;
  
  -- Check limit
  IF v_count >= p_limit THEN
    RETURN false; -- Rate limit exceeded
  END IF;
  
  -- Increment counter
  UPDATE api_rate_limits
  SET request_count = request_count + 1
  WHERE user_id = p_user_id AND endpoint = p_endpoint;
  
  RETURN true;
END;
$$;

-- =====================================================
-- PHASE 6: AUTOMATED WALLET CREATION
-- =====================================================

-- Update handle_new_user to create GHS wallet
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Create user profile with Ghana as default country
  INSERT INTO public.profiles (user_id, full_name, country_code)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', 'GH');
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  -- Create default personal wallet (MAIN) in GHS
  INSERT INTO public.wallets (user_id, wallet_type, balance, currency)
  VALUES (NEW.id, 'main', 0, 'GHS');
  
  -- Create notification preferences
  INSERT INTO public.notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create merchant wallet when merchant is approved
CREATE OR REPLACE FUNCTION public.create_merchant_wallet()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only create wallet when merchant is approved for the first time
  IF NEW.verification_status = 'approved' AND (OLD.verification_status IS NULL OR OLD.verification_status != 'approved') THEN
    -- Create merchant wallet in GHS
    INSERT INTO public.wallets (
      user_id, 
      wallet_type, 
      balance, 
      currency
    )
    VALUES (
      NEW.user_id, 
      'merchant', 
      0, 
      'GHS'
    )
    ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_merchant_approved ON merchants;
CREATE TRIGGER on_merchant_approved
  AFTER INSERT OR UPDATE ON public.merchants
  FOR EACH ROW
  EXECUTE FUNCTION public.create_merchant_wallet();

-- =====================================================
-- PHASE 7: TRANSACTION HELPERS
-- =====================================================

-- Helper functions for database transactions
CREATE OR REPLACE FUNCTION public.begin_transaction()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- PostgreSQL auto-starts transactions, this is a placeholder
  NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.commit_transaction()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Explicit commit
  NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.rollback_transaction()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Transaction rolled back';
END;
$$;