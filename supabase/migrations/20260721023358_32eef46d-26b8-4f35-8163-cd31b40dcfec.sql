
-- Prevent paid resources from being served out of the public "resources" bucket.
-- The private bucket + generate-download-url edge function already enforces purchase checks;
-- this guarantees paid content can never regress to a publicly readable path.

CREATE OR REPLACE FUNCTION public.enforce_paid_resource_is_private()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_is_private boolean;
  v_file_url text;
BEGIN
  IF NEW.is_active IS DISTINCT FROM true OR COALESCE(NEW.price, 0) <= 0 THEN
    RETURN NEW;
  END IF;

  SELECT is_private, file_url INTO v_is_private, v_file_url
  FROM public.resources
  WHERE id = NEW.resource_id;

  IF v_is_private IS NULL THEN
    RETURN NEW; -- resource missing; other FKs will handle
  END IF;

  IF v_is_private IS NOT TRUE THEN
    RAISE EXCEPTION 'Paid resources must be marked is_private=true and stored in the resources-private bucket';
  END IF;

  IF v_file_url IS NOT NULL AND length(trim(v_file_url)) > 0
     AND v_file_url NOT LIKE 'resources-private/%'
     AND v_file_url NOT LIKE '%/resources-private/%' THEN
    RAISE EXCEPTION 'Paid resources cannot reference the public resources bucket';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_paid_resource_is_private ON public.products;
CREATE TRIGGER trg_enforce_paid_resource_is_private
BEFORE INSERT OR UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.enforce_paid_resource_is_private();

-- Also block flipping a resource back to public / public-bucket URL while it has an active paid product.
CREATE OR REPLACE FUNCTION public.enforce_resource_stays_private_if_paid()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_has_paid boolean;
BEGIN
  IF (NEW.is_private IS DISTINCT FROM OLD.is_private AND NEW.is_private IS NOT TRUE)
     OR (NEW.file_url IS DISTINCT FROM OLD.file_url
         AND NEW.file_url IS NOT NULL
         AND NEW.file_url NOT LIKE 'resources-private/%'
         AND NEW.file_url NOT LIKE '%/resources-private/%') THEN
    SELECT EXISTS (
      SELECT 1 FROM public.products
      WHERE resource_id = NEW.id AND is_active = true AND COALESCE(price, 0) > 0
    ) INTO v_has_paid;

    IF v_has_paid THEN
      RAISE EXCEPTION 'Cannot expose a paid resource via the public bucket. Keep is_private=true and use resources-private storage.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_resource_stays_private_if_paid ON public.resources;
CREATE TRIGGER trg_enforce_resource_stays_private_if_paid
BEFORE UPDATE ON public.resources
FOR EACH ROW EXECUTE FUNCTION public.enforce_resource_stays_private_if_paid();
