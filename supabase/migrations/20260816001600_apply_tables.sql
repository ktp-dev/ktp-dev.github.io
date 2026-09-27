-- Applicant portal tables. One active rush cycle at a time; history kept
-- so the same person can apply again next semester.
-- Reviewer tables are a later migration.

CREATE TABLE public.rush_cycles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  opens_at timestamptz NOT NULL,
  closes_at timestamptz NOT NULL,
  intro_markdown text,
  hear_about_options text[] NOT NULL DEFAULT ARRAY[]::text[],
  is_active boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT rush_cycles_dates_ok CHECK (closes_at > opens_at)
);

-- At most one row with is_active = true.
CREATE UNIQUE INDEX rush_cycles_one_active
  ON public.rush_cycles (is_active)
  WHERE is_active;

CREATE TABLE public.cycle_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id uuid NOT NULL REFERENCES public.rush_cycles (id) ON DELETE CASCADE,
  prompt text NOT NULL,
  help_text text,
  max_words integer NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  required boolean NOT NULL DEFAULT true,
  CONSTRAINT cycle_questions_max_words_positive CHECK (max_words > 0)
);

CREATE INDEX cycle_questions_cycle_id_idx
  ON public.cycle_questions (cycle_id, sort_order);

CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id uuid NOT NULL REFERENCES public.rush_cycles (id) ON DELETE RESTRICT,
  user_id uuid NOT NULL,
  email text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  submitted_at timestamptz,
  first_name text,
  last_name text,
  preferred_name text,
  pronouns text,
  phone text,
  majors text,
  minors text,
  graduation_year integer,
  gpa numeric(5, 3),
  semesters_remaining integer,
  other_professional_fraternity boolean,
  campus_activities text,
  hear_about text[],
  hear_about_other text,
  anything_else text,
  rush_feedback text,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT applications_status_check CHECK (status IN ('draft', 'submitted')),
  CONSTRAINT applications_cycle_user_unique UNIQUE (cycle_id, user_id)
);

CREATE INDEX applications_user_id_idx ON public.applications (user_id);
CREATE INDEX applications_cycle_status_idx ON public.applications (cycle_id, status);

CREATE TABLE public.application_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.applications (id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES public.cycle_questions (id) ON DELETE RESTRICT,
  body text,
  CONSTRAINT application_answers_app_question_unique UNIQUE (application_id, question_id)
);

CREATE TABLE public.application_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.applications (id) ON DELETE CASCADE,
  slot text NOT NULL,
  s3_key text NOT NULL,
  mime_type text,
  size_bytes integer,
  original_filename text,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT application_files_slot_check CHECK (
    slot IN (
      'photo',
      'transcript',
      'resume',
      'resume_anonymized',
      'life_app_screenshot'
    )
  ),
  CONSTRAINT application_files_app_slot_unique UNIQUE (application_id, slot)
);

CREATE TRIGGER update_rush_cycles_updated_at
  BEFORE UPDATE ON public.rush_cycles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS (defense in depth; Drizzle still uses DATABASE_URL and bypasses it)

ALTER TABLE public.rush_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cycle_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Rush cycles are publicly readable"
  ON public.rush_cycles FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage rush cycles"
  ON public.rush_cycles
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Cycle questions are publicly readable"
  ON public.cycle_questions FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage cycle questions"
  ON public.cycle_questions
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Applicants can read own applications"
  ON public.applications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Applicants can insert own applications"
  ON public.applications FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Applicants can update own drafts"
  ON public.applications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() AND status = 'draft')
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update applications"
  ON public.applications FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Applicants can read own answers"
  ON public.application_answers FOR SELECT
  TO authenticated
  USING (
    public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1
      FROM public.applications AS a
      WHERE a.id = application_id
        AND a.user_id = auth.uid()
    )
  );

CREATE POLICY "Applicants can write answers on own drafts"
  ON public.application_answers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.applications AS a
      WHERE a.id = application_id
        AND a.user_id = auth.uid()
        AND a.status = 'draft'
    )
  );

CREATE POLICY "Applicants can update answers on own drafts"
  ON public.application_answers FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.applications AS a
      WHERE a.id = application_id
        AND a.user_id = auth.uid()
        AND a.status = 'draft'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.applications AS a
      WHERE a.id = application_id
        AND a.user_id = auth.uid()
        AND a.status = 'draft'
    )
  );

CREATE POLICY "Admins can manage answers"
  ON public.application_answers
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Applicants can read own files"
  ON public.application_files FOR SELECT
  TO authenticated
  USING (
    public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1
      FROM public.applications AS a
      WHERE a.id = application_id
        AND a.user_id = auth.uid()
    )
  );

CREATE POLICY "Applicants can insert files on own drafts"
  ON public.application_files FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.applications AS a
      WHERE a.id = application_id
        AND a.user_id = auth.uid()
        AND a.status = 'draft'
    )
  );

CREATE POLICY "Applicants can update files on own drafts"
  ON public.application_files FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.applications AS a
      WHERE a.id = application_id
        AND a.user_id = auth.uid()
        AND a.status = 'draft'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.applications AS a
      WHERE a.id = application_id
        AND a.user_id = auth.uid()
        AND a.status = 'draft'
    )
  );

CREATE POLICY "Applicants can delete files on own drafts"
  ON public.application_files FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.applications AS a
      WHERE a.id = application_id
        AND a.user_id = auth.uid()
        AND a.status = 'draft'
    )
  );

CREATE POLICY "Admins can manage files"
  ON public.application_files
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

GRANT ALL ON TABLE public.rush_cycles TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.cycle_questions TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.applications TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.application_answers TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.application_files TO anon, authenticated, service_role;
