-- Defense-in-depth: ensure private resources never store their file in the public 'resources' bucket.
-- Private files must be delivered exclusively via the generate-download-url edge function
-- using the resource_private_files table and the private 'resources-private' bucket.

CREATE OR REPLACE FUNCTION public.enforce_private_resource_storage()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.is_private = true AND NEW.file_url IS NOT NULL AND length(trim(NEW.file_url)) > 0 THEN
    -- Allow only paths that clearly target the private bucket (or absolute private-signed URLs).
    IF NEW.file_url NOT LIKE 'resources-private/%'
       AND NEW.file_url NOT LIKE '%/resources-private/%' THEN
      RAISE EXCEPTION 'Private resources must store files in the resources-private bucket, not the public resources bucket';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_private_resource_storage_trg ON public.resources;
CREATE TRIGGER enforce_private_resource_storage_trg
BEFORE INSERT OR UPDATE OF is_private, file_url ON public.resources
FOR EACH ROW
EXECUTE FUNCTION public.enforce_private_resource_storage();
