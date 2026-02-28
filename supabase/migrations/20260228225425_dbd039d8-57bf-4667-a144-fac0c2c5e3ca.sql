
ALTER TABLE public.contact_submissions
  ADD COLUMN first_name text,
  ADD COLUMN last_name text,
  ADD COLUMN company_name text,
  ADD COLUMN position text,
  ADD COLUMN questions text;

UPDATE public.contact_submissions SET first_name = name, questions = message;

ALTER TABLE public.contact_submissions
  ALTER COLUMN first_name SET NOT NULL,
  DROP COLUMN name,
  DROP COLUMN message;

ALTER TABLE public.contact_submissions
  ALTER COLUMN company_name SET NOT NULL,
  ALTER COLUMN questions SET NOT NULL;
