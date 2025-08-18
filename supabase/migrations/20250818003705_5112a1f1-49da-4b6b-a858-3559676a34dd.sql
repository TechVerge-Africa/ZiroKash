-- Create credit cards table
CREATE TABLE public.credit_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  card_name TEXT NOT NULL,
  card_number TEXT NOT NULL,
  card_type TEXT NOT NULL DEFAULT 'debit',
  credit_limit NUMERIC NOT NULL DEFAULT 0,
  current_balance NUMERIC NOT NULL DEFAULT 0,
  minimum_payment NUMERIC NOT NULL DEFAULT 0,
  due_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_frozen BOOLEAN NOT NULL DEFAULT false,
  security_settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create investments table
CREATE TABLE public.investments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  asset_name TEXT NOT NULL,
  asset_type TEXT NOT NULL, -- stocks, bonds, crypto, real_estate, commodities
  symbol TEXT,
  shares_owned NUMERIC NOT NULL DEFAULT 0,
  purchase_price NUMERIC NOT NULL DEFAULT 0,
  current_price NUMERIC NOT NULL DEFAULT 0,
  total_invested NUMERIC NOT NULL DEFAULT 0,
  current_value NUMERIC NOT NULL DEFAULT 0,
  profit_loss NUMERIC NOT NULL DEFAULT 0,
  profit_loss_percentage NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create crypto portfolio table
CREATE TABLE public.crypto_portfolio (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  balance NUMERIC NOT NULL DEFAULT 0,
  purchase_price NUMERIC NOT NULL DEFAULT 0,
  current_price NUMERIC NOT NULL DEFAULT 0,
  total_value NUMERIC NOT NULL DEFAULT 0,
  profit_loss NUMERIC NOT NULL DEFAULT 0,
  profit_loss_percentage NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.credit_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crypto_portfolio ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for credit_cards
CREATE POLICY "Users can view own credit cards" 
ON public.credit_cards 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own credit cards" 
ON public.credit_cards 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own credit cards" 
ON public.credit_cards 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for investments
CREATE POLICY "Users can view own investments" 
ON public.investments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own investments" 
ON public.investments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own investments" 
ON public.investments 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for crypto_portfolio
CREATE POLICY "Users can view own crypto portfolio" 
ON public.crypto_portfolio 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own crypto portfolio" 
ON public.crypto_portfolio 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own crypto portfolio" 
ON public.crypto_portfolio 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_credit_cards_updated_at
BEFORE UPDATE ON public.credit_cards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_investments_updated_at
BEFORE UPDATE ON public.investments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crypto_portfolio_updated_at
BEFORE UPDATE ON public.crypto_portfolio
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();