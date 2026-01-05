-- Create function to set wallet balance (for syncing with Paystack)
CREATE OR REPLACE FUNCTION public.set_wallet_balance(
  _user_id UUID,
  _wallet_type TEXT,
  _amount DECIMAL,
  _currency TEXT DEFAULT 'GHS'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert or update wallet with the exact balance from Paystack
  INSERT INTO public.wallets (user_id, wallet_type, balance, currency)
  VALUES (_user_id, _wallet_type, _amount, _currency)
  ON CONFLICT (user_id, wallet_type, currency)
  DO UPDATE SET 
    balance = _amount,
    updated_at = now();
END;
$$;
