-- Cycle owns the public /rush page (blurb + links) and its schedule.
-- Existing events are attached to the live cycle, or the newest cycle.

ALTER TABLE public.rush_cycles
  ADD COLUMN public_blurb text,
  ADD COLUMN interest_form_url text,
  ADD COLUMN youtube_url text,
  ADD COLUMN calendar_url text;

ALTER TABLE public.rush_events
  ADD COLUMN cycle_id uuid REFERENCES public.rush_cycles (id) ON DELETE CASCADE;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.rush_events WHERE cycle_id IS NULL) THEN
    IF NOT EXISTS (SELECT 1 FROM public.rush_cycles) THEN
      INSERT INTO public.rush_cycles (name, opens_at, closes_at, is_active)
      VALUES (
        'Untitled',
        timezone('utc'::text, now()),
        timezone('utc'::text, now()) + interval '30 days',
        true
      );
    END IF;

    UPDATE public.rush_events
    SET cycle_id = COALESCE(
      (SELECT id FROM public.rush_cycles WHERE is_active LIMIT 1),
      (SELECT id FROM public.rush_cycles ORDER BY created_at DESC LIMIT 1)
    )
    WHERE cycle_id IS NULL;
  END IF;
END $$;

ALTER TABLE public.rush_events
  ALTER COLUMN cycle_id SET NOT NULL;

CREATE INDEX rush_events_cycle_id_idx
  ON public.rush_events (cycle_id, order_index);
