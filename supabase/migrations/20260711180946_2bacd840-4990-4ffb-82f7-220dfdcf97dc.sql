CREATE OR REPLACE FUNCTION public.prevent_profile_role_self_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF public.has_role(auth.uid(), 'admin'::app_role) THEN
      RETURN NEW;
    END IF;
    -- Allow the user's first (onboarding) role selection: interests is NULL
    -- until the /signup/role form is submitted.
    IF auth.uid() = NEW.id AND OLD.interests IS NULL THEN
      RETURN NEW;
    END IF;
    RAISE EXCEPTION 'Only admins can change the role on a profile';
  END IF;
  RETURN NEW;
END;
$$;