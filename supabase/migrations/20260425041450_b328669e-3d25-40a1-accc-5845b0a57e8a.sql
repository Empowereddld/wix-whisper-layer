
ALTER TABLE public.storybuilders_waitlist
ADD COLUMN IF NOT EXISTS last_share_at timestamp with time zone;

CREATE OR REPLACE FUNCTION public.record_share(
  p_referral_code text,
  p_platform text,
  p_points_per_share integer,
  p_daily_cap integer,
  p_first_share_bonus integer
)
RETURNS TABLE(success boolean, points_awarded integer, new_points integer, capped boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_record RECORD;
  v_today date := CURRENT_DATE;
  v_now timestamptz := now();
  v_cooldown_seconds integer := 10;
  v_shares_today integer;
  v_award integer := 0;
  v_first_bonus integer := 0;
BEGIN
  SELECT id, points, share_count, shares_today, last_share_date,
         first_share_bonus_awarded, last_share_at
  INTO v_record
  FROM public.storybuilders_waitlist
  WHERE referral_code = p_referral_code
  FOR UPDATE;

  IF v_record IS NULL THEN
    RETURN QUERY SELECT false, 0, 0, false;
    RETURN;
  END IF;

  -- Anti-abuse: enforce cooldown between any two share events
  IF v_record.last_share_at IS NOT NULL
     AND v_record.last_share_at > v_now - (v_cooldown_seconds || ' seconds')::interval THEN
    RETURN QUERY SELECT true, 0, v_record.points, true;
    RETURN;
  END IF;

  -- Reset daily counter if new day
  IF v_record.last_share_date IS NULL OR v_record.last_share_date <> v_today THEN
    v_shares_today := 0;
  ELSE
    v_shares_today := v_record.shares_today;
  END IF;

  -- Check daily cap (cap is in POINTS, so divide)
  IF (v_shares_today * p_points_per_share) >= p_daily_cap THEN
    RETURN QUERY SELECT true, 0, v_record.points, true;
    RETURN;
  END IF;

  v_award := p_points_per_share;

  -- First share bonus
  IF NOT v_record.first_share_bonus_awarded THEN
    v_first_bonus := p_first_share_bonus;
  END IF;

  UPDATE public.storybuilders_waitlist
  SET points = points + v_award + v_first_bonus,
      share_count = share_count + 1,
      shares_today = v_shares_today + 1,
      last_share_date = v_today,
      last_share_at = v_now,
      first_share_bonus_awarded = true
  WHERE id = v_record.id;

  RETURN QUERY SELECT true, v_award + v_first_bonus, v_record.points + v_award + v_first_bonus, false;
END;
$function$;
