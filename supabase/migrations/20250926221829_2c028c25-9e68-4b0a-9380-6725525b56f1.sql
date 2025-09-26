-- Create user roles enum
CREATE TYPE user_role AS ENUM ('user', 'merchant', 'admin');
CREATE TYPE kyc_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE transaction_type AS ENUM ('p2p', 'bill_payment', 'merchant_payment', 'corporate_collection', 'deposit', 'withdraw');
CREATE TYPE transaction_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');
CREATE TYPE card_status AS ENUM ('active', 'frozen', 'cancelled');

-- Update profiles table with KYC and additional fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS kyc_status kyc_status DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS kyc_documents JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS country_code TEXT DEFAULT 'NG',
ADD COLUMN IF NOT EXISTS verification_level INTEGER DEFAULT 1;

-- Create user_roles table for role-based access
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'user',
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    assigned_by UUID REFERENCES auth.users(id),
    UNIQUE(user_id, role)
);

-- Update wallets table for multi-currency support
ALTER TABLE public.wallets 
ALTER COLUMN balance TYPE BIGINT USING (balance * 100)::BIGINT, -- Store in cents to avoid floating point
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS daily_limit BIGINT DEFAULT 100000000, -- 1M cents = 10,000 currency units
ADD COLUMN IF NOT EXISTS monthly_limit BIGINT DEFAULT 500000000; -- 5M cents = 50,000 currency units

-- Update transactions table with comprehensive payment support
ALTER TABLE public.transactions 
ALTER COLUMN amount TYPE BIGINT USING (amount * 100)::BIGINT, -- Store in cents
ADD COLUMN IF NOT EXISTS transaction_fee BIGINT DEFAULT 0,
ADD COLUMN IF NOT EXISTS external_reference TEXT,
ADD COLUMN IF NOT EXISTS payment_method TEXT,
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS processed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS webhook_url TEXT;

-- Create merchants table
CREATE TABLE IF NOT EXISTS public.merchants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    business_email TEXT NOT NULL,
    business_phone TEXT,
    business_address TEXT,
    business_registration_number TEXT,
    api_key TEXT UNIQUE,
    webhook_url TEXT,
    is_active BOOLEAN DEFAULT true,
    verification_status kyc_status DEFAULT 'pending',
    commission_rate DECIMAL(5,4) DEFAULT 0.0250, -- 2.5%
    settlement_account_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create virtual_cards table
CREATE TABLE IF NOT EXISTS public.virtual_cards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
    card_number TEXT NOT NULL, -- Encrypted
    card_holder_name TEXT NOT NULL,
    expiry_month INTEGER NOT NULL,
    expiry_year INTEGER NOT NULL,
    cvv TEXT NOT NULL, -- Encrypted
    status card_status DEFAULT 'active',
    spending_limit BIGINT DEFAULT 10000000, -- 100,000 cents
    daily_limit BIGINT DEFAULT 5000000, -- 50,000 cents
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create bills table for bill payments
CREATE TABLE IF NOT EXISTS public.bills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    biller_name TEXT NOT NULL,
    biller_code TEXT NOT NULL,
    account_number TEXT NOT NULL,
    amount BIGINT NOT NULL,
    transaction_id UUID REFERENCES public.transactions(id),
    bill_type TEXT NOT NULL, -- airtime, electricity, water, internet, etc.
    status transaction_status DEFAULT 'pending',
    external_reference TEXT,
    metadata JSONB DEFAULT '{}',
    due_date TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create payment_methods table for cash in/out
CREATE TABLE IF NOT EXISTS public.payment_methods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider TEXT NOT NULL, -- paystack, flutterwave, bank, momo
    provider_reference TEXT NOT NULL,
    method_type TEXT NOT NULL, -- bank_account, mobile_money, card
    account_details JSONB NOT NULL,
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create corporate_collections table
CREATE TABLE IF NOT EXISTS public.corporate_collections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    merchant_id UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
    customer_email TEXT NOT NULL,
    amount BIGINT NOT NULL,
    currency TEXT DEFAULT 'NGN',
    description TEXT,
    reference TEXT UNIQUE NOT NULL,
    status transaction_status DEFAULT 'pending',
    payment_url TEXT,
    webhook_data JSONB,
    expires_at TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create fraud_alerts table
CREATE TABLE IF NOT EXISTS public.fraud_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES public.transactions(id),
    alert_type TEXT NOT NULL,
    risk_score INTEGER NOT NULL,
    metadata JSONB DEFAULT '{}',
    is_resolved BOOLEAN DEFAULT false,
    resolved_by UUID REFERENCES auth.users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.virtual_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corporate_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_alerts ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = _user_id AND role = _role
    );
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for merchants
CREATE POLICY "Users can view own merchant data" ON public.merchants
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own merchant data" ON public.merchants
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own merchant data" ON public.merchants
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all merchants" ON public.merchants
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for virtual_cards
CREATE POLICY "Users can manage own cards" ON public.virtual_cards
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for bills
CREATE POLICY "Users can manage own bills" ON public.bills
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for payment_methods
CREATE POLICY "Users can manage own payment methods" ON public.payment_methods
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for corporate_collections
CREATE POLICY "Merchants can view own collections" ON public.corporate_collections
    FOR SELECT USING (
        merchant_id IN (
            SELECT id FROM public.merchants WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Merchants can insert collections" ON public.corporate_collections
    FOR INSERT WITH CHECK (
        merchant_id IN (
            SELECT id FROM public.merchants WHERE user_id = auth.uid()
        )
    );

-- RLS Policies for fraud_alerts
CREATE POLICY "Admins can view all fraud alerts" ON public.fraud_alerts
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own fraud alerts" ON public.fraud_alerts
    FOR SELECT USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_merchants_user_id ON public.merchants(user_id);
CREATE INDEX IF NOT EXISTS idx_merchants_api_key ON public.merchants(api_key);
CREATE INDEX IF NOT EXISTS idx_virtual_cards_user_id ON public.virtual_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_virtual_cards_wallet_id ON public.virtual_cards(wallet_id);
CREATE INDEX IF NOT EXISTS idx_bills_user_id ON public.bills(user_id);
CREATE INDEX IF NOT EXISTS idx_bills_status ON public.bills(status);
CREATE INDEX IF NOT EXISTS idx_transactions_type_status ON public.transactions(transaction_type, status);
CREATE INDEX IF NOT EXISTS idx_corporate_collections_reference ON public.corporate_collections(reference);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_user_id ON public.fraud_alerts(user_id);

-- Update handle_new_user function to create default role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  -- Create default wallets with bigint amounts (in cents)
  INSERT INTO public.wallets (user_id, wallet_type, balance, currency)
  VALUES 
    (NEW.id, 'main', 0, 'NGN'),
    (NEW.id, 'savings', 0, 'NGN'),
    (NEW.id, 'investment', 0, 'NGN');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();