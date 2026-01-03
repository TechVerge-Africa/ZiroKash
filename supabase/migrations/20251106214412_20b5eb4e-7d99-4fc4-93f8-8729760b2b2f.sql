-- Create form_api_keys table
CREATE TABLE public.form_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID REFERENCES public.payment_forms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  api_key TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.form_api_keys ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own API keys"
ON public.form_api_keys FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can create own API keys"
ON public.form_api_keys FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own API keys"
ON public.form_api_keys FOR UPDATE
USING (user_id = auth.uid());

-- Create storage bucket for receipts and logos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('zirokash', 'zirokash', true);

-- Storage policies for logos and receipts
CREATE POLICY "Users can upload own files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'zirokash' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view own files"
ON storage.objects FOR SELECT
USING (bucket_id = 'zirokash' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Public can view receipts"
ON storage.objects FOR SELECT
USING (bucket_id = 'zirokash' AND (storage.foldername(name))[2] = 'receipts');

-- Add indexes
CREATE INDEX idx_form_api_keys_form_id ON public.form_api_keys(form_id);
CREATE INDEX idx_form_api_keys_user_id ON public.form_api_keys(user_id);
CREATE INDEX idx_form_api_keys_api_key ON public.form_api_keys(api_key);
CREATE INDEX idx_form_submissions_form_id ON public.form_submissions(form_id);
CREATE INDEX idx_form_submissions_status ON public.form_submissions(status);