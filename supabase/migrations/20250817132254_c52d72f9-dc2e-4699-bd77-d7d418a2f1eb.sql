-- Fix security warnings by setting proper search paths for functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  
  -- Create default wallets
  INSERT INTO public.wallets (user_id, wallet_type, balance, currency)
  VALUES 
    (NEW.id, 'main', 0, 'USD'),
    (NEW.id, 'savings', 0, 'USD'),
    (NEW.id, 'investment', 0, 'USD');
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;