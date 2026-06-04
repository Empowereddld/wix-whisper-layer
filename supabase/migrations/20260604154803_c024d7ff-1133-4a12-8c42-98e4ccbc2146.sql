
ALTER TABLE public.storybuilders_waitlist
  ADD COLUMN IF NOT EXISTS speech_professional_rejected boolean NOT NULL DEFAULT false;

-- Update approve to also write to audit_logs
CREATE OR REPLACE FUNCTION public.verify_speech_professional(p_waitlist_id uuid, p_bonus integer)
 RETURNS TABLE(success boolean, new_points integer, message text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_record RECORD;
  v_admin uuid := auth.uid();
BEGIN
  IF NOT has_role(v_admin, 'admin'::app_role) THEN
    RETURN QUERY SELECT false, 0, 'Admin only'::text;
    RETURN;
  END IF;

  SELECT id, email, points, is_speech_professional, speech_professional_verified
  INTO v_record
  FROM public.storybuilders_waitlist
  WHERE id = p_waitlist_id
  FOR UPDATE;

  IF v_record IS NULL THEN
    RETURN QUERY SELECT false, 0, 'Not found'::text;
    RETURN;
  END IF;

  IF v_record.speech_professional_verified THEN
    RETURN QUERY SELECT true, v_record.points, 'Already verified'::text;
    RETURN;
  END IF;

  UPDATE public.storybuilders_waitlist
  SET speech_professional_verified = true,
      is_speech_professional = true,
      speech_professional_rejected = false,
      points = points + p_bonus
  WHERE id = v_record.id;

  INSERT INTO public.audit_logs (admin_id, action)
  VALUES (v_admin, 'slp.approve waitlist_id=' || v_record.id::text || ' email=' || COALESCE(v_record.email,'') || ' bonus=' || p_bonus::text);

  RETURN QUERY SELECT true, v_record.points + p_bonus, 'Verified and points awarded'::text;
END;
$function$;

-- Reject: mark as rejected, no points change
CREATE OR REPLACE FUNCTION public.reject_speech_professional(p_waitlist_id uuid)
 RETURNS TABLE(success boolean, message text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_record RECORD;
  v_admin uuid := auth.uid();
BEGIN
  IF NOT has_role(v_admin, 'admin'::app_role) THEN
    RETURN QUERY SELECT false, 'Admin only'::text;
    RETURN;
  END IF;

  SELECT id, email, speech_professional_verified
  INTO v_record
  FROM public.storybuilders_waitlist
  WHERE id = p_waitlist_id
  FOR UPDATE;

  IF v_record IS NULL THEN
    RETURN QUERY SELECT false, 'Not found'::text;
    RETURN;
  END IF;

  IF v_record.speech_professional_verified THEN
    RETURN QUERY SELECT false, 'Already verified, cannot reject'::text;
    RETURN;
  END IF;

  UPDATE public.storybuilders_waitlist
  SET speech_professional_rejected = true
  WHERE id = v_record.id;

  INSERT INTO public.audit_logs (admin_id, action)
  VALUES (v_admin, 'slp.reject waitlist_id=' || v_record.id::text || ' email=' || COALESCE(v_record.email,''));

  RETURN QUERY SELECT true, 'Rejected'::text;
END;
$function$;

-- Reset a rejected entry back to pending (Rejected -> queue again)
CREATE OR REPLACE FUNCTION public.reset_speech_professional_rejection(p_waitlist_id uuid)
 RETURNS TABLE(success boolean, message text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_record RECORD;
  v_admin uuid := auth.uid();
BEGIN
  IF NOT has_role(v_admin, 'admin'::app_role) THEN
    RETURN QUERY SELECT false, 'Admin only'::text;
    RETURN;
  END IF;

  SELECT id, email, speech_professional_rejected, speech_professional_verified
  INTO v_record
  FROM public.storybuilders_waitlist
  WHERE id = p_waitlist_id
  FOR UPDATE;

  IF v_record IS NULL THEN
    RETURN QUERY SELECT false, 'Not found'::text;
    RETURN;
  END IF;

  IF v_record.speech_professional_verified THEN
    RETURN QUERY SELECT false, 'Already verified'::text;
    RETURN;
  END IF;

  IF NOT v_record.speech_professional_rejected THEN
    RETURN QUERY SELECT true, 'Already pending'::text;
    RETURN;
  END IF;

  UPDATE public.storybuilders_waitlist
  SET speech_professional_rejected = false
  WHERE id = v_record.id;

  INSERT INTO public.audit_logs (admin_id, action)
  VALUES (v_admin, 'slp.reset_to_pending waitlist_id=' || v_record.id::text || ' email=' || COALESCE(v_record.email,''));

  RETURN QUERY SELECT true, 'Reset to pending'::text;
END;
$function$;
