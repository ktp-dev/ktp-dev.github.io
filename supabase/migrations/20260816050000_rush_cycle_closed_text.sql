-- Closed-application copy shown on /apply when the cycle is not accepting responses.

ALTER TABLE public.rush_cycles
  ADD COLUMN closed_markdown text;
