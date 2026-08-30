-- Switch admins from auth user ids to emails so we can allowlist
-- addresses before anyone logs in. Existing id rows are backfilled
-- from auth.users when this runs on a database that already has admins.

ALTER TABLE public.admins
  ADD COLUMN IF NOT EXISTS email text;

UPDATE public.admins AS a
SET email = lower(u.email)
FROM auth.users AS u
WHERE u.id = a.id
  AND a.email IS NULL;

DELETE FROM public.admins
WHERE email IS NULL;

ALTER TABLE public.admins
  DROP CONSTRAINT IF EXISTS admins_id_fkey;

ALTER TABLE public.admins
  DROP CONSTRAINT IF EXISTS admins_pkey;

ALTER TABLE public.admins
  DROP COLUMN IF EXISTS id;

ALTER TABLE public.admins
  ALTER COLUMN email SET NOT NULL;

ALTER TABLE public.admins
  ADD CONSTRAINT admins_pkey PRIMARY KEY (email);

CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.admins AS a
    INNER JOIN auth.users AS u ON lower(u.email) = a.email
    WHERE u.id = user_id
  );
END;
$$;
