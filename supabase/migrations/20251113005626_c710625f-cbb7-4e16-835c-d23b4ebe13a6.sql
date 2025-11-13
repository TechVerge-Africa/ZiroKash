-- Add settlement account fields to merchants table
ALTER TABLE merchants 
ADD COLUMN settlement_type TEXT,
ADD COLUMN settlement_account JSONB,
ADD COLUMN min_settlement_amount BIGINT DEFAULT 1000,
ADD COLUMN settlement_frequency TEXT DEFAULT 'daily';

-- Create settlements table
CREATE TABLE settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  amount BIGINT NOT NULL,
  settlement_type TEXT NOT NULL,
  settlement_account JSONB NOT NULL,
  status TEXT DEFAULT 'pending',
  paystack_reference TEXT,
  initiated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies for settlements
ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;

-- Merchants can view their own settlements
CREATE POLICY "Merchants can view own settlements"
ON settlements
FOR SELECT
USING (
  merchant_id IN (
    SELECT id FROM merchants WHERE user_id = auth.uid()
  )
);

-- System can insert settlements (via edge functions)
CREATE POLICY "System can insert settlements"
ON settlements
FOR INSERT
WITH CHECK (true);

-- System can update settlements (via edge functions)
CREATE POLICY "System can update settlements"
ON settlements
FOR UPDATE
USING (true);

-- Add updated_at trigger for settlements
CREATE TRIGGER update_settlements_updated_at
BEFORE UPDATE ON settlements
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add index for better performance
CREATE INDEX idx_settlements_merchant_status ON settlements(merchant_id, status);
CREATE INDEX idx_settlements_status ON settlements(status);