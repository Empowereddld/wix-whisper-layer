ALTER TABLE public.contact_submissions
  ADD COLUMN role text,
  ADD COLUMN interested_in text[],
  ADD COLUMN preferred_timeline text;