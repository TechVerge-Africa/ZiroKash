-- Create merchant_withdrawals table to track manual withdrawals
CREATE TABLE IF NOT EXISTS merchant_withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- Amount in pesewas/cents
  withdrawal_method TEXT NOT NULL CHECK (withdrawal_method IN ('momo', 'bank')),
  phone_number TEXT, -- For mobile money withdrawals
  provider TEXT, -- MTN, VOD, ATL for mobile money
  account_number TEXT, -- For bank withdrawals
  bank_code TEXT, -- For bank withdrawals
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  paystack_reference TEXT, -- Paystack transfer reference
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create index for faster merchant queries
CREATE INDEX IF NOT EXISTS idx_merchant_withdrawals_merchant_id ON merchant_withdrawals(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_withdrawals_status ON merchant_withdrawals(status);
CREATE INDEX IF NOT EXISTS idx_merchant_withdrawals_created_at ON merchant_withdrawals(created_at DESC);

-- Add RLS policies
ALTER TABLE merchant_withdrawals ENABLE ROW LEVEL SECURITY;

-- Merchants can view their own withdrawals
CREATE POLICY "Merchants can view own withdrawals"
  ON merchant_withdrawals
  FOR SELECT
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

-- Merchants can insert their own withdrawals (via edge function only)
CREATE POLICY "Merchants can create withdrawals via edge function"
  ON merchant_withdrawals
  FOR INSERT
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );
