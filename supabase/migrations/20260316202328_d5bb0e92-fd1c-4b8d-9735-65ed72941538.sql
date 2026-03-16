ALTER TABLE public.resources ADD COLUMN page_count integer NULL;
UPDATE public.resources SET page_count = 25 WHERE id = '2630ce77-c3b2-49cd-bf73-da63799d0d0a';