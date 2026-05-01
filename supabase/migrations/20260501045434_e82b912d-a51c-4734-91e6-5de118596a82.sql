-- Partial unique index for active rows
ALTER TABLE public.storybuilders_waitlist DROP CONSTRAINT IF EXISTS storybuilders_waitlist_email_key;
DROP INDEX IF EXISTS public.storybuilders_waitlist_email_key;

CREATE UNIQUE INDEX IF NOT EXISTS storybuilders_waitlist_email_active_unique
  ON public.storybuilders_waitlist (email)
  WHERE deleted_at IS NULL;

-- Drop existing function signatures so we can change return types
DROP FUNCTION IF EXISTS public.admin_soft_delete_waitlist_entry(uuid, text);
DROP FUNCTION IF EXISTS public.admin_soft_delete_waitlist_entry(uuid);
DROP FUNCTION IF EXISTS public.admin_restore_waitlist_entry(uuid);

CREATE FUNCTION public.admin_soft_delete_waitlist_entry(
  p_id uuid,
  p_reason text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin uuid := auth.uid();
BEGIN
  IF NOT public.has_role(v_admin, 'admin'::app_role) THEN
    RAISE EXCEPTION 'Only admins can soft-delete waitlist entries';
  END IF;

  UPDATE public.storybuilders_waitlist
  SET deleted_at = now(),
      deleted_by = v_admin,
      deleted_reason = p_reason
  WHERE id = p_id;
END;
$$;

CREATE FUNCTION public.admin_restore_waitlist_entry(
  p_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin uuid := auth.uid();
  v_email text;
  v_conflict_count int;
BEGIN
  IF NOT public.has_role(v_admin, 'admin'::app_role) THEN
    RAISE EXCEPTION 'Only admins can restore waitlist entries';
  END IF;

  SELECT email INTO v_email
  FROM public.storybuilders_waitlist
  WHERE id = p_id;

  IF v_email IS NULL THEN
    RAISE EXCEPTION 'Waitlist entry not found';
  END IF;

  v_email := regexp_replace(v_email, '\.deleted\.\d+$', '');

  SELECT count(*) INTO v_conflict_count
  FROM public.storybuilders_waitlist
  WHERE email = v_email
    AND deleted_at IS NULL
    AND id <> p_id;

  IF v_conflict_count > 0 THEN
    RAISE EXCEPTION 'An active waitlist entry with this email already exists';
  END IF;

  UPDATE public.storybuilders_waitlist
  SET deleted_at = NULL,
      deleted_by = NULL,
      deleted_reason = NULL,
      email = v_email
  WHERE id = p_id;
END;
$$;

-- Backfill: strip ".deleted.<timestamp>" suffixes from existing soft-deleted rows
UPDATE public.storybuilders_waitlist
SET email = regexp_replace(email, '\.deleted\.\d+$', '')
WHERE deleted_at IS NOT NULL
  AND email ~ '\.deleted\.\d+$';
