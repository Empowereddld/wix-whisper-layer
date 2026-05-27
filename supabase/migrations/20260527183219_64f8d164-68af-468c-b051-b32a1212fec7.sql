DROP FUNCTION IF EXISTS public.verify_waitlist_and_award(uuid, integer);

CREATE OR REPLACE FUNCTION public.verify_waitlist_and_award(p_waitlist_id uuid, p_bonus integer DEFAULT 15)
 RETURNS TABLE(
   out_verified_now boolean,
   out_already_verified boolean,
   out_email text,
   out_name text,
   out_referral_code text,
   out_welcome_sent_at timestamp with time zone,
   out_new_points integer
 )
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v RECORD;
BEGIN
  SELECT id, email, email_verified, name, referral_code, welcome_sent_at, points, deleted_at
    INTO v
  FROM public.storybuilders_waitlist
  WHERE id = p_waitlist_id
  FOR UPDATE;

  IF NOT FOUND OR v.deleted_at IS NOT NULL THEN
    RETURN QUERY SELECT false, false, NULL::text, NULL::text, NULL::text, NULL::timestamptz, NULL::integer;
    RETURN;
  END IF;

  IF v.email_verified THEN
    RETURN QUERY SELECT false, true, v.email, v.name, v.referral_code, v.welcome_sent_at, v.points;
    RETURN;
  END IF;

  UPDATE public.storybuilders_waitlist
  SET email_verified = true,
      verified_at = now(),
      points = COALESCE(points, 0) + COALESCE(p_bonus, 0)
  WHERE id = v.id;

  RETURN QUERY SELECT true, false, v.email, v.name, v.referral_code, v.welcome_sent_at,
    COALESCE(v.points, 0) + COALESCE(p_bonus, 0);
END;
$function$;