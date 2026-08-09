UPDATE public.resources
SET file_url = NULL
WHERE is_private = true AND file_url IS NOT NULL;

ALTER TABLE public.resources
  ADD CONSTRAINT resources_private_has_no_public_file_url
  CHECK (is_private = false OR file_url IS NULL);

CREATE OR REPLACE FUNCTION public.enforce_private_resource_storage()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.is_private = true THEN
    IF NEW.file_url IS NOT NULL AND length(trim(NEW.file_url)) > 0 THEN
      RAISE EXCEPTION 'Private resources must not store a file path on resources.file_url; use resource_private_files (resources-private bucket) instead';
    END IF;
    NEW.file_url := NULL;
  END IF;
  RETURN NEW;
END;
$$;