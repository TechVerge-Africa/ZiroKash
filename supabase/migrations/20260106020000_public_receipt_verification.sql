-- Function to allow public verification of receipts without exposing the entire table
CREATE OR REPLACE FUNCTION public.verify_receipt_details(p_receipt_no TEXT, p_verify_code TEXT)
RETURNS TABLE (
  id UUID,
  payer_name TEXT,
  amount BIGINT,
  status TEXT,
  created_at TIMESTAMPTZ,
  form_title TEXT,
  merchant_name TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with owner privileges to bypass RLS for this specific query
AS $$
DECLARE
    v_id_part_start TEXT;
    v_id_part_end TEXT;
BEGIN
    v_id_part_start := lower(replace(p_receipt_no, 'REC-', ''));
    v_id_part_end := lower(p_verify_code);
    
    RETURN QUERY
    SELECT 
        s.id,
        s.payer_name,
        s.amount,
        s.status,
        s.created_at,
        f.title as form_title,
        COALESCE(p.full_name, 'Verification Validated') as merchant_name
    FROM public.form_submissions s
    JOIN public.payment_forms f ON s.form_id = f.id
    LEFT JOIN public.profiles p ON f.user_id = p.id
    WHERE s.status = 'paid'
      AND (s.id::text ILIKE v_id_part_start || '%')
      AND (s.id::text ILIKE '%' || v_id_part_end)
    LIMIT 1;
END;
$$;

-- Grant access to anon and authenticated roles
GRANT EXECUTE ON FUNCTION public.verify_receipt_details(TEXT, TEXT) TO anon, authenticated;

