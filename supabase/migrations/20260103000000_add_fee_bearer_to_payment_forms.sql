-- Add fee_bearer column to payment_forms table
ALTER TABLE payment_forms 
ADD COLUMN fee_bearer TEXT DEFAULT 'customer' 
CHECK (fee_bearer IN ('merchant', 'customer'));

COMMENT ON COLUMN payment_forms.fee_bearer IS 'Who pays the processing fee: customer (default) or merchant';
