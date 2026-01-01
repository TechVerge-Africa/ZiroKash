-- Change transaction_id from UUID to TEXT to support alphanumeric references
ALTER TABLE public.form_submissions 
ALTER COLUMN transaction_id TYPE TEXT;

-- Update increment_wallet_balance to ensure it handles currency consistently
CREATE OR REPLACE FUNCTION public.increment_wallet_balance(
  _user_id UUID,
  _wallet_type TEXT,
  _amount DECIMAL,
  _currency TEXT DEFAULT 'GHS'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.wallets (user_id, wallet_type, balance, currency)
  VALUES (_user_id, _wallet_type, _amount, _currency)
  ON CONFLICT (user_id, wallet_type, currency)
  DO UPDATE SET 
    balance = public.wallets.balance + EXCLUDED.balance,
    updated_at = now();
END;
$$;
