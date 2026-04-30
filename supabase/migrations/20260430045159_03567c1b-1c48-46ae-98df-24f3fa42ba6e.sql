-- Make verify_speech_professional idempotent so it never double-awards points,
-- in case an admin clicks Verify on someone who was already auto-verified at signup.
CREATE OR REPLACE FUNCTION public.verify_speech_professional(p_waitlist_id uuid, p_bonus integer)
 RETURNS TABLE(success boolean, new_points integer, message text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_record RECORD;
BEGIN
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN QUERY SELECT false, 0, 'Admin only'::text;
    RETURN;
  END IF;

  SELECT id, points, is_speech_professional, speech_professional_verified
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
      points = points + p_bonus
  WHERE id = v_record.id;

  RETURN QUERY SELECT true, v_record.points + p_bonus, 'Verified and points awarded'::text;
END;
$function$;

-- Backfill: any existing self-identified SLP who hasn't been verified yet
-- gets auto-verified and the +50 bonus right now.
UPDATE public.storybuilders_waitlist
SET speech_professional_verified = true,
    points = points + 50
WHERE is_speech_professional = true
  AND speech_professional_verified = false
  AND deleted_at IS NULL;