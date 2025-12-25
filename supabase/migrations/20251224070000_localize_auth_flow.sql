-- Localize new user onboarding for Ghana with improved robustness
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile with Ghana defaults
  INSERT INTO public.profiles (user_id, full_name, country_code)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'GH'
  );
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Create default wallets with bigint amounts in GHS (Cedi)
  -- balance 0 is 0 cents since we store integers
  INSERT INTO public.wallets (user_id, wallet_type, balance, currency)
  VALUES 
    (NEW.id, 'main', 0, 'GHS'),
    (NEW.id, 'savings', 0, 'GHS'),
    (NEW.id, 'investment', 0, 'GHS'),
    (NEW.id, 'merchant', 0, 'GHS')
  ON CONFLICT (user_id, wallet_type, currency) DO NOTHING;
  
  RETURN NEW;
END;
$$;
