-- Assign Admin Role to specific user
DO $$
DECLARE
  target_email TEXT := 'asulley@techverge.africa';
  target_user_id UUID;
BEGIN
  -- 1. Find the user ID from auth.users
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = target_email;

  -- 2. If user exists, update/insert their role
  IF target_user_id IS NOT NULL THEN
    -- Remove any existing role first to avoid unique constraint if needed, or just upsert
    -- We'll use ON CONFLICT to handle it gracefully if we had a unique constraint on user_id
    -- But since user_role is an enum and we have a unique constraint on (user_id, role), we might need to handle duplicate "admin" entries if they existed differently
    -- Our schema says: UNIQUE(user_id, role)
    
    INSERT INTO public.user_roles (user_id, role, assigned_by)
    VALUES (target_user_id, 'admin', target_user_id)
    ON CONFLICT (user_id, role) DO NOTHING;
    
    -- Raise notice for confirmation
    RAISE NOTICE 'Admin role assigned to %', target_email;
  ELSE
    RAISE NOTICE 'User % not found in auth.users. Please sign up first.', target_email;
  END IF;
END $$;
