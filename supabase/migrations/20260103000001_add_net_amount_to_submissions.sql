-- Add net_amount and fees columns to form_submissions table
ALTER TABLE form_submissions 
ADD COLUMN net_amount BIGINT,
ADD COLUMN fees BIGINT;

COMMENT ON COLUMN form_submissions.net_amount IS 'The amount received by the merchant in subunits (pesewas)';
COMMENT ON COLUMN form_submissions.fees IS 'The processing fee deducted by Paystack in subunits (pesewas)';
