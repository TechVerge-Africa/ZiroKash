-- Create settlements table to track Paystack payouts
CREATE TABLE IF NOT EXISTS public.settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE,
  paystack_transfer_code TEXT UNIQUE,
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GHS',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'reversed')),
  recipient_bank_code TEXT,
  recipient_account_number TEXT,
  recipient_account_name TEXT,
  settled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.settlements ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Merchants can view own settlements"
ON public.settlements FOR SELECT
USING (
  merchant_id IN (
    SELECT id FROM public.merchants WHERE user_id = auth.uid()
  )
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_settlements_merchant_id ON public.settlements(merchant_id);
CREATE INDEX IF NOT EXISTS idx_settlements_status ON public.settlements(status);
CREATE INDEX IF NOT EXISTS idx_settlements_created_at ON public.settlements(created_at DESC);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_settlements_updated_at ON public.settlements;
CREATE TRIGGER update_settlements_updated_at
  BEFORE UPDATE ON public.settlements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create balance cache table for 1-hour caching
CREATE TABLE IF NOT EXISTS public.paystack_balance_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID UNIQUE REFERENCES public.merchants(id) ON DELETE CASCADE,
  available_balance DECIMAL(15,2) NOT NULL DEFAULT 0,
  ledger_balance DECIMAL(15,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'GHS',
  cached_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '1 hour')
);

-- Enable RLS
ALTER TABLE public.paystack_balance_cache ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Merchants can view own balance cache"
ON public.paystack_balance_cache FOR SELECT
USING (
  merchant_id IN (
    SELECT id FROM public.merchants WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Service role can manage balance cache"
ON public.paystack_balance_cache FOR ALL
USING (true);

-- Index
CREATE INDEX IF NOT EXISTS idx_balance_cache_merchant_id ON public.paystack_balance_cache(merchant_id);
CREATE INDEX IF NOT EXISTS idx_balance_cache_expires_at ON public.paystack_balance_cache(expires_at);
