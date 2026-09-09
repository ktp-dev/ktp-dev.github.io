-- Directory fields for brothers. contact_email stays on the table for later
-- (alumni / CSV); the admin add/edit form uses LinkedIn + photo instead.
-- Columns stay nullable so CSV/alumni imports can still land incomplete rows;
-- the admin form enforces first name, last name, umich email, and pledge class.

ALTER TABLE public.brothers ADD COLUMN IF NOT EXISTS linkedin_url text;
ALTER TABLE public.brothers ADD COLUMN IF NOT EXISTS photo_filename text;
