-- Add public access policy for payment forms
-- This allows anyone with a link to view and submit to active payment forms

-- Add policy to allow public SELECT access to active payment forms
CREATE POLICY "Public can view active payment forms"
  ON public.payment_forms
  FOR SELECT
  USING (is_active = true);

-- Ensure form_submissions table allows public inserts (already exists but adding comment)
COMMENT ON POLICY "Anyone can insert submissions" ON public.form_submissions IS 
  'Allows public users to submit payments to any active form';
