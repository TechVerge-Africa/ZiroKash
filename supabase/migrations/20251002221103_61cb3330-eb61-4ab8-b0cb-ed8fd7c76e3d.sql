-- Add blockchain infrastructure fields to existing tables
ALTER TABLE public.wallets 
ADD COLUMN IF NOT EXISTS blockchain_network TEXT,
ADD COLUMN IF NOT EXISTS stablecoin_contract TEXT,
ADD COLUMN IF NOT EXISTS on_chain_balance BIGINT DEFAULT 0;

ALTER TABLE public.transactions 
ADD COLUMN IF NOT EXISTS blockchain_hash TEXT,
ADD COLUMN IF NOT EXISTS blockchain_network TEXT;

-- Create blockchain_addresses table for managing user crypto wallets
CREATE TABLE IF NOT EXISTS public.blockchain_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
  blockchain_network TEXT NOT NULL,
  address TEXT NOT NULL UNIQUE,
  private_key_encrypted TEXT NOT NULL,
  phone_number TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create user_identifiers table for multi-channel recipient lookup
CREATE TABLE IF NOT EXISTS public.user_identifiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  identifier_type TEXT NOT NULL,
  identifier_value TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(identifier_type, identifier_value)
);

-- Enable RLS on new tables
ALTER TABLE public.blockchain_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_identifiers ENABLE ROW LEVEL SECURITY;

-- RLS policies for blockchain_addresses
CREATE POLICY "Users can view own blockchain addresses" ON public.blockchain_addresses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own blockchain addresses" ON public.blockchain_addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own blockchain addresses" ON public.blockchain_addresses
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for user_identifiers
CREATE POLICY "Users can view own identifiers" ON public.user_identifiers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own identifiers" ON public.user_identifiers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own identifiers" ON public.user_identifiers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can lookup identifiers" ON public.user_identifiers
  FOR SELECT USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_blockchain_addresses_user_id ON public.blockchain_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_blockchain_addresses_network ON public.blockchain_addresses(blockchain_network);
CREATE INDEX IF NOT EXISTS idx_blockchain_addresses_address ON public.blockchain_addresses(address);
CREATE INDEX IF NOT EXISTS idx_user_identifiers_lookup ON public.user_identifiers(identifier_type, identifier_value);
CREATE INDEX IF NOT EXISTS idx_user_identifiers_user_id ON public.user_identifiers(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_blockchain_hash ON public.transactions(blockchain_hash);

-- Create trigger for updated_at on blockchain_addresses
CREATE TRIGGER update_blockchain_addresses_updated_at
  BEFORE UPDATE ON public.blockchain_addresses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();