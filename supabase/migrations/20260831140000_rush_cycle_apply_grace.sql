-- Extra minutes after closes_at before apply edits lock (not shown to rushees).
-- Default 2 matches the previous hard-coded APPLY_CLOSE_GRACE_MS.

ALTER TABLE public.rush_cycles
  ADD COLUMN IF NOT EXISTS apply_close_grace_minutes integer NOT NULL DEFAULT 2;

ALTER TABLE public.rush_cycles
  ADD CONSTRAINT rush_cycles_apply_close_grace_minutes_check
  CHECK (apply_close_grace_minutes >= 0);
