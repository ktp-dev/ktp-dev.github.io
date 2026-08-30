-- Chapter people. umich_email is the /portal login key and is optional
-- so alumni without a umich address can still exist as rows.
-- Existing admins are backfilled so they can sign in after /portal ships.

CREATE TABLE public.brothers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text,
  last_name text,
  umich_email text,
  contact_email text,
  status text NOT NULL DEFAULT 'active',
  pledge_class text,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT brothers_status_check CHECK (status IN ('active', 'alumni'))
);

CREATE UNIQUE INDEX brothers_umich_email_key
  ON public.brothers (umich_email)
  WHERE umich_email IS NOT NULL;

CREATE TRIGGER update_brothers_updated_at
  BEFORE UPDATE ON public.brothers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.brothers (umich_email, status)
SELECT lower(a.email), 'active'
FROM public.admins AS a
WHERE NOT EXISTS (
  SELECT 1
  FROM public.brothers AS b
  WHERE b.umich_email = lower(a.email)
);

ALTER TABLE public.brothers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage brothers"
  ON public.brothers
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Brothers can read own row"
  ON public.brothers FOR SELECT
  TO authenticated
  USING (
    umich_email IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM auth.users AS u
      WHERE u.id = auth.uid()
        AND lower(u.email) = umich_email
    )
  );
