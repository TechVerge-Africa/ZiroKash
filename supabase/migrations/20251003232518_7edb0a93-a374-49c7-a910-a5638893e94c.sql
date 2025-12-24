-- Add DELETE RLS policies for all user tables

-- Profiles
CREATE POLICY "Users can delete own profile"
ON public.profiles
FOR DELETE
USING (auth.uid() = user_id);

-- Wallets
CREATE POLICY "Users can delete own wallets"
ON public.wallets
FOR DELETE
USING (auth.uid() = user_id);

-- Transactions
CREATE POLICY "Users can delete own transactions"
ON public.transactions
FOR DELETE
USING (auth.uid() = user_id);

-- Blockchain addresses
CREATE POLICY "Users can delete own blockchain addresses"
ON public.blockchain_addresses
FOR DELETE
USING (auth.uid() = user_id);

-- Credit cards
CREATE POLICY "Users can delete own credit cards"
ON public.credit_cards
FOR DELETE
USING (auth.uid() = user_id);

-- Crypto portfolio
CREATE POLICY "Users can delete own crypto portfolio"
ON public.crypto_portfolio
FOR DELETE
USING (auth.uid() = user_id);

-- Investments
CREATE POLICY "Users can delete own investments"
ON public.investments
FOR DELETE
USING (auth.uid() = user_id);

-- Savings plans
CREATE POLICY "Users can delete own savings plans"
ON public.savings_plans
FOR DELETE
USING (auth.uid() = user_id);

-- User identifiers
CREATE POLICY "Users can delete own identifiers"
ON public.user_identifiers
FOR DELETE
USING (auth.uid() = user_id);

-- Virtual cards
CREATE POLICY "Users can delete own virtual cards"
ON public.virtual_cards
FOR DELETE
USING (auth.uid() = user_id);