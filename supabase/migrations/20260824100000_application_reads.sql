-- Application reads: reviewer access, rubric, reviews, assignment locks.
-- Scoped per rush cycle. Drizzle uses DATABASE_URL; RLS is defense in depth.

CREATE OR REPLACE FUNCTION public.is_reviewer(user_id uuid, p_cycle_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.is_admin(user_id) THEN
    RETURN true;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.review_access AS ra
    INNER JOIN auth.users AS u ON lower(u.email) = lower(ra.email)
    WHERE u.id = user_id
      AND ra.cycle_id = p_cycle_id
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.is_reviewer(uuid, uuid) TO anon, authenticated, service_role;

-- Reviewer allowlist (per cycle)
CREATE TABLE public.review_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id uuid NOT NULL REFERENCES public.rush_cycles (id) ON DELETE CASCADE,
  email text NOT NULL,
  min_required_reviews integer NOT NULL DEFAULT 12,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT review_access_email_nonempty CHECK (length(trim(email)) > 0),
  CONSTRAINT review_access_min_reviews_ok CHECK (min_required_reviews >= 0),
  CONSTRAINT review_access_cycle_email_unique UNIQUE (cycle_id, email)
);

CREATE INDEX review_access_cycle_id_idx ON public.review_access (cycle_id);
CREATE INDEX review_access_email_idx ON public.review_access (lower(email));

-- Configurable rubric categories (per cycle)
CREATE TABLE public.rubric_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id uuid NOT NULL REFERENCES public.rush_cycles (id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  scale_min integer NOT NULL DEFAULT 1,
  scale_max integer NOT NULL DEFAULT 4,
  rating_labels jsonb,
  archived_at timestamptz,
  CONSTRAINT rubric_categories_title_nonempty CHECK (length(trim(title)) > 0),
  CONSTRAINT rubric_categories_scale_ok CHECK (scale_min >= 1 AND scale_max >= scale_min)
);

CREATE INDEX rubric_categories_cycle_id_idx
  ON public.rubric_categories (cycle_id, sort_order);

-- Assignment lock + read queue fields on submitted applications
ALTER TABLE public.applications
  ADD COLUMN display_number integer,
  ADD COLUMN assigned_reviewer_id uuid,
  ADD COLUMN assigned_at timestamptz,
  ADD COLUMN assignment_expires_at timestamptz,
  ADD COLUMN review_count integer NOT NULL DEFAULT 0;

ALTER TABLE public.applications
  ADD CONSTRAINT applications_review_count_ok CHECK (review_count >= 0);

CREATE UNIQUE INDEX applications_cycle_display_number_unique
  ON public.applications (cycle_id, display_number)
  WHERE display_number IS NOT NULL;

CREATE INDEX applications_read_queue_idx
  ON public.applications (cycle_id, status, review_count, submitted_at)
  WHERE status = 'submitted';

CREATE INDEX applications_assigned_reviewer_idx
  ON public.applications (assigned_reviewer_id)
  WHERE assigned_reviewer_id IS NOT NULL;

-- Backfill display numbers for already-submitted applications (submit order per cycle)
WITH numbered AS (
  SELECT
    id,
    row_number() OVER (
      PARTITION BY cycle_id
      ORDER BY submitted_at ASC NULLS LAST, created_at ASC, id ASC
    ) AS num
  FROM public.applications
  WHERE status = 'submitted'
    AND submitted_at IS NOT NULL
)
UPDATE public.applications AS a
SET display_number = numbered.num
FROM numbered
WHERE a.id = numbered.id;

-- One review row per reviewer per application (immutable after submit)
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.applications (id) ON DELETE CASCADE,
  reviewer_user_id uuid NOT NULL,
  notes text,
  started_at timestamptz,
  ended_at timestamptz,
  submitted_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT reviews_notes_length CHECK (notes IS NULL OR char_length(notes) <= 1000),
  CONSTRAINT reviews_application_reviewer_unique UNIQUE (application_id, reviewer_user_id)
);

CREATE INDEX reviews_application_id_idx ON public.reviews (application_id);
CREATE INDEX reviews_reviewer_user_id_idx ON public.reviews (reviewer_user_id);

-- Normalized scores (one row per rubric category per review)
CREATE TABLE public.review_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid NOT NULL REFERENCES public.reviews (id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES public.rubric_categories (id) ON DELETE RESTRICT,
  score smallint NOT NULL,
  CONSTRAINT review_scores_score_range CHECK (score >= 1 AND score <= 4),
  CONSTRAINT review_scores_review_category_unique UNIQUE (review_id, category_id)
);

CREATE INDEX review_scores_category_id_idx ON public.review_scores (category_id);

-- Default rubric (7 categories from prior review portal) for cycles without one yet
INSERT INTO public.rubric_categories (cycle_id, title, sort_order, scale_min, scale_max)
SELECT
  c.id,
  seed.title,
  seed.sort_order,
  1,
  4
FROM public.rush_cycles AS c
CROSS JOIN (
  VALUES
    (
      0,
      'Did the applicant put effort into the application (including the resume)?'
    ),
    (1, 'Did the applicant display creativity and passion for technology?'),
    (2, 'Does the applicant''s ideas draw on their experiences/identity?'),
    (
      3,
      'Does the applicant demonstrate passion or interests that would resonate with brothers?'
    ),
    (4, 'Does the applicant express a love for community?'),
    (
      5,
      'Does the applicant express a desire to learn from KTP/give back to the community?'
    ),
    (
      6,
      'Does the applicant''s resume demonstrate drive and initiative which can be expanded upon by KTP?'
    )
) AS seed (sort_order, title)
WHERE NOT EXISTS (
  SELECT 1
  FROM public.rubric_categories AS rc
  WHERE rc.cycle_id = c.id
);

-- RLS

ALTER TABLE public.review_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rubric_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage review access"
  ON public.review_access
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Rubric categories are publicly readable"
  ON public.rubric_categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage rubric categories"
  ON public.rubric_categories
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage reviews"
  ON public.reviews
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage review scores"
  ON public.review_scores
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

GRANT ALL ON TABLE public.review_access TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.rubric_categories TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.reviews TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.review_scores TO anon, authenticated, service_role;
