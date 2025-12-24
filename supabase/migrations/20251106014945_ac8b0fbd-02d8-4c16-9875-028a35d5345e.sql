-- Create table for payment forms
CREATE TABLE IF NOT EXISTS public.payment_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  fields JSONB NOT NULL DEFAULT '[]'::jsonb,
  theme_color TEXT DEFAULT '#0056D2',
  logo_url TEXT,
  signature_url TEXT,
  receipt_template JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_forms ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own payment forms"
  ON public.payment_forms
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payment forms"
  ON public.payment_forms
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payment forms"
  ON public.payment_forms
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own payment forms"
  ON public.payment_forms
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create table for form submissions
CREATE TABLE IF NOT EXISTS public.form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID NOT NULL REFERENCES public.payment_forms(id) ON DELETE CASCADE,
  submission_data JSONB NOT NULL,
  amount BIGINT NOT NULL,
  status TEXT DEFAULT 'pending',
  payer_email TEXT,
  payer_name TEXT,
  transaction_id UUID,
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Form owners can view submissions"
  ON public.form_submissions
  FOR SELECT
  USING (
    form_id IN (
      SELECT id FROM public.payment_forms WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert submissions"
  ON public.form_submissions
  FOR INSERT
  WITH CHECK (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_payment_forms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payment_forms_updated_at
  BEFORE UPDATE ON public.payment_forms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_payment_forms_updated_at();