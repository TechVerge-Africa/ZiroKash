-- 1. Identify and remove duplicate merchant records
-- logic: Keep the one with V2 code, then V1 code, then most recent.
-- We use a CTE to identify the IDs to KEEP.

WITH keepers AS (
  SELECT id
  FROM (
    SELECT id,
      ROW_NUMBER() OVER (
        PARTITION BY user_id
        ORDER BY
          CASE WHEN paystack_subaccount_code_v2 IS NOT NULL THEN 1 ELSE 2 END ASC, -- Prefer records with V2 code
          CASE WHEN paystack_subaccount_code IS NOT NULL THEN 1 ELSE 2 END ASC,    -- Then records with V1 code
          created_at DESC -- Then most recent
      ) as rnum
    FROM merchants
  ) t
  WHERE t.rnum = 1
)
DELETE FROM merchants
WHERE id NOT IN (SELECT id FROM keepers);

-- 2. Add Unique Constraints
-- This prevents a user from ever creating more than one merchant record
ALTER TABLE merchants
DROP CONSTRAINT IF EXISTS merchants_user_id_key;

ALTER TABLE merchants
ADD CONSTRAINT merchants_user_id_key UNIQUE (user_id);

-- Optional: If you also want to enforce Business Email uniqueness (one business email per platform)
-- This might cause issues if a user deletes an account and tries to reuse email, but good for "one account" rule.
-- ALTER TABLE merchants ADD CONSTRAINT merchants_business_email_key UNIQUE (business_email);
