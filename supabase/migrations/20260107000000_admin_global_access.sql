-- Admin Global Access Migration
-- Allows users with the 'admin' role to view all records in key tables for reporting.

-- 1. Policies for Merchants
CREATE POLICY "Admins can view all merchants" 
ON public.merchants FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- 2. Policies for Payment Forms
CREATE POLICY "Admins can view all payment forms" 
ON public.payment_forms FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- 3. Policies for Form Submissions
CREATE POLICY "Admins can view all form submissions" 
ON public.form_submissions FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- 4. Policies for Wallets (Admin view only)
CREATE POLICY "Admins can view all wallets" 
ON public.wallets FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));
