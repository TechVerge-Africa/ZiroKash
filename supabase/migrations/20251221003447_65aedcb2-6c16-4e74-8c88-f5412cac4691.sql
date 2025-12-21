-- Add public access RLS policy for active payment forms
CREATE POLICY "Anyone can view active payment forms"
ON public.payment_forms
FOR SELECT
USING (is_active = true);