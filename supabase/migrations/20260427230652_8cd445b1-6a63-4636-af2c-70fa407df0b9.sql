-- Soft delete support for storybuilders_waitlist
ALTER TABLE public.storybuilders_waitlist
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
  ADD COLUMN IF NOT EXISTS deleted_by uuid,
  ADD COLUMN IF NOT EXISTS deleted_reason text;

CREATE INDEX IF NOT EXISTS idx_storybuilders_waitlist_deleted_at
  ON public.storybuilders_waitlist (deleted_at);

-- Allow admins to UPDATE rows (needed for soft delete + restore)
DROP POLICY IF EXISTS "Admins can update waitlist entries" ON public.storybuilders_waitlist;
CREATE POLICY "Admins can update waitlist entries"
  ON public.storybuilders_waitlist
  FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Soft-delete RPC: marks the row, frees the email (suffix), and logs to audit_logs
CREATE OR REPLACE FUNCTION public.admin_soft_delete_waitlist_entry(
  p_id uuid,
  p_reason text DEFAULT NULL
)
RETURNS TABLE(success boolean, message text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin uuid := auth.uid();
  v_record RECORD;
BEGIN
  IF NOT has_role(v_admin, 'admin'::app_role) THEN
    RETURN QUERY SELECT false, 'Admin only'::text;
    RETURN;
  END IF;

  SELECT id, email, deleted_at INTO v_record
  FROM public.storybuilders_waitlist WHERE id = p_id FOR UPDATE;

  IF v_record IS NULL THEN
    RETURN QUERY SELECT false, 'Not found'::text;
    RETURN;
  END IF;

  IF v_record.deleted_at IS NOT NULL THEN
    RETURN QUERY SELECT false, 'Already deleted'::text;
    RETURN;
  END IF;

  -- Free the email so they can rejoin (append suffix)
  UPDATE public.storybuilders_waitlist
  SET deleted_at = now(),
      deleted_by = v_admin,
      deleted_reason = p_reason,
      email = email || '.deleted.' || extract(epoch from now())::bigint
  WHERE id = p_id;

  INSERT INTO public.audit_logs (admin_id, action)
  VALUES (v_admin, 'soft_delete_waitlist:' || v_record.email || COALESCE(' reason=' || p_reason, ''));

  RETURN QUERY SELECT true, 'Deleted'::text;
END;
$$;

-- Restore RPC
CREATE OR REPLACE FUNCTION public.admin_restore_waitlist_entry(p_id uuid)
RETURNS TABLE(success boolean, message text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin uuid := auth.uid();
  v_record RECORD;
  v_clean_email text;
BEGIN
  IF NOT has_role(v_admin, 'admin'::app_role) THEN
    RETURN QUERY SELECT false, 'Admin only'::text;
    RETURN;
  END IF;

  SELECT id, email, deleted_at INTO v_record
  FROM public.storybuilders_waitlist WHERE id = p_id FOR UPDATE;

  IF v_record IS NULL OR v_record.deleted_at IS NULL THEN
    RETURN QUERY SELECT false, 'Not deleted'::text;
    RETURN;
  END IF;

  v_clean_email := regexp_replace(v_record.email, '\.deleted\.\d+$', '');

  -- If someone re-joined with that email, refuse restore
  IF EXISTS (SELECT 1 FROM public.storybuilders_waitlist
             WHERE email = v_clean_email AND id <> p_id AND deleted_at IS NULL) THEN
    RETURN QUERY SELECT false, 'Email is in use by another active entry'::text;
    RETURN;
  END IF;

  UPDATE public.storybuilders_waitlist
  SET deleted_at = NULL,
      deleted_by = NULL,
      deleted_reason = NULL,
      email = v_clean_email
  WHERE id = p_id;

  INSERT INTO public.audit_logs (admin_id, action)
  VALUES (v_admin, 'restore_waitlist:' || v_clean_email);

  RETURN QUERY SELECT true, 'Restored'::text;
END;
$$;