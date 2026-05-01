-- ============================================================
-- Phase 3 fixes: tier-5 points doubling + SLP referrer delta
-- (click dedup was already per-referrer via the existing
--  unique index on (referral_code, ip_address, click_date))
-- ============================================================

-- Tier 5 threshold = 250 pts. Points double from this tier on.
-- Helper: given a user's CURRENT points (before awarding) and a base award,
-- return the multiplied award. We use current_points so that crossing 250
-- mid-award doesn't retroactively double the part below 250 -- the doubling
-- only kicks in once a user is already at/over 250.
CREATE OR REPLACE FUNCTION public.apply_tier_multiplier(
  p_current_points integer,
  p_base_award integer
) RETURNS integer
LANGUAGE sql
IMMUTABLE
SET search_path TO 'public'
AS $$
  SELECT CASE
    WHEN p_current_points >= 250 THEN p_base_award * 2
    ELSE p_base_award
  END;
$$;

-- ---------- award_referral: double when referrer already at Tier 5 ----------
CREATE OR REPLACE FUNCTION public.award_referral(
  p_referrer_code text,
  p_referral_points integer,
  p_first_bonus integer
)
RETURNS TABLE(success boolean, new_points integer, new_invite_count integer, first_bonus_awarded boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user RECORD;
  v_award integer;
  v_first boolean := false;
BEGIN
  SELECT id, points, invite_count, first_referral_bonus_awarded
  INTO v_user
  FROM public.storybuilders_waitlist
  WHERE referral_code = p_referrer_code
  FOR UPDATE;

  IF v_user IS NULL THEN
    RETURN QUERY SELECT false, 0, 0, false;
    RETURN;
  END IF;

  v_award := public.apply_tier_multiplier(v_user.points, p_referral_points);
  IF NOT v_user.first_referral_bonus_awarded THEN
    v_award := v_award + public.apply_tier_multiplier(v_user.points, p_first_bonus);
    v_first := true;
  END IF;

  UPDATE public.storybuilders_waitlist
  SET points = points + v_award,
      invite_count = invite_count + 1,
      first_referral_bonus_awarded = true
  WHERE id = v_user.id;

  RETURN QUERY SELECT true, v_user.points + v_award, v_user.invite_count + 1, v_first;
END;
$$;

-- ---------- claim_social_follow: double when ≥ Tier 5 ----------
CREATE OR REPLACE FUNCTION public.claim_social_follow(
  p_referral_code text,
  p_platform text,
  p_points integer
)
RETURNS TABLE(success boolean, already_claimed boolean, new_points integer, message text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_record RECORD;
  v_award integer;
BEGIN
  IF p_platform NOT IN ('instagram', 'facebook', 'youtube') THEN
    RETURN QUERY SELECT false, false, 0, 'Invalid platform'::text;
    RETURN;
  END IF;

  SELECT id, points, social_claims
  INTO v_record
  FROM public.storybuilders_waitlist
  WHERE referral_code = p_referral_code
  FOR UPDATE;

  IF v_record IS NULL THEN
    RETURN QUERY SELECT false, false, 0, 'Waitlist entry not found'::text;
    RETURN;
  END IF;

  IF (v_record.social_claims ? p_platform) THEN
    RETURN QUERY SELECT true, true, v_record.points, 'Already claimed'::text;
    RETURN;
  END IF;

  v_award := public.apply_tier_multiplier(v_record.points, p_points);

  UPDATE public.storybuilders_waitlist
  SET points = points + v_award,
      social_claims = social_claims || jsonb_build_object(
        p_platform, jsonb_build_object('claimed_at', now(), 'points', v_award)
      )
  WHERE id = v_record.id;

  RETURN QUERY SELECT true, false, v_record.points + v_award, 'Points awarded'::text;
END;
$$;

-- ---------- record_share: double share + first-share bonus when ≥ Tier 5 ----------
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
AS $$
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

  IF v_record.last_share_at IS NOT NULL
     AND v_record.last_share_at > v_now - (v_cooldown_seconds || ' seconds')::interval THEN
    RETURN QUERY SELECT true, 0, v_record.points, true;
    RETURN;
  END IF;

  IF v_record.last_share_date IS NULL OR v_record.last_share_date <> v_today THEN
    v_shares_today := 0;
  ELSE
    v_shares_today := v_record.shares_today;
  END IF;

  -- Daily cap is in BASE points (pre-multiplier) so caps stay predictable
  IF (v_shares_today * p_points_per_share) >= p_daily_cap THEN
    RETURN QUERY SELECT true, 0, v_record.points, true;
    RETURN;
  END IF;

  v_award := public.apply_tier_multiplier(v_record.points, p_points_per_share);

  IF NOT v_record.first_share_bonus_awarded THEN
    v_first_bonus := public.apply_tier_multiplier(v_record.points, p_first_share_bonus);
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
$$;

-- ---------- record_referral_click: double when ≥ Tier 5 ----------
CREATE OR REPLACE FUNCTION public.record_referral_click(
  p_referral_code text,
  p_ip_address text,
  p_points integer,
  p_daily_cap integer
)
RETURNS TABLE(success boolean, awarded boolean, reason text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_record RECORD;
  v_today date := CURRENT_DATE;
  v_clicks_today integer;
  v_inserted boolean := false;
  v_award integer;
BEGIN
  SELECT id, points, click_count, clicks_today, last_click_date
  INTO v_record
  FROM public.storybuilders_waitlist
  WHERE referral_code = p_referral_code
  FOR UPDATE;

  IF v_record IS NULL THEN
    RETURN QUERY SELECT false, false, 'Referrer not found'::text;
    RETURN;
  END IF;

  -- Per-referrer dedup: unique on (referral_code, ip_address, click_date)
  BEGIN
    INSERT INTO public.referral_clicks (referral_code, ip_address, click_date)
    VALUES (p_referral_code, p_ip_address, v_today);
    v_inserted := true;
  EXCEPTION WHEN unique_violation THEN
    v_inserted := false;
  END;

  IF NOT v_inserted THEN
    RETURN QUERY SELECT true, false, 'IP already counted today for this referrer'::text;
    RETURN;
  END IF;

  IF v_record.last_click_date IS NULL OR v_record.last_click_date <> v_today THEN
    v_clicks_today := 0;
  ELSE
    v_clicks_today := v_record.clicks_today;
  END IF;

  -- Daily cap in BASE points
  IF (v_clicks_today * p_points) >= p_daily_cap THEN
    UPDATE public.storybuilders_waitlist
    SET click_count = click_count + 1,
        clicks_today = v_clicks_today + 1,
        last_click_date = v_today
    WHERE id = v_record.id;
    RETURN QUERY SELECT true, false, 'Daily cap reached'::text;
    RETURN;
  END IF;

  v_award := public.apply_tier_multiplier(v_record.points, p_points);

  UPDATE public.storybuilders_waitlist
  SET points = points + v_award,
      click_count = click_count + 1,
      clicks_today = v_clicks_today + 1,
      last_click_date = v_today
  WHERE id = v_record.id;

  RETURN QUERY SELECT true, true, 'Point awarded'::text;
END;
$$;

-- ---------- award_slp_referral_bonus: top up referrer by SLP delta ----------
-- Called from storybuilders-signup edge fn when the new signup self-IDs as SLP
-- AND has a referrer. Adds the +25 delta on top of the base referral award so
-- the referrer ends up with the full SLP_REFERRAL_TOTAL of 50 for that referral.
CREATE OR REPLACE FUNCTION public.award_slp_referral_bonus(
  p_referrer_code text,
  p_bonus integer
)
RETURNS TABLE(success boolean, new_points integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user RECORD;
  v_award integer;
BEGIN
  SELECT id, points
  INTO v_user
  FROM public.storybuilders_waitlist
  WHERE referral_code = p_referrer_code
  FOR UPDATE;

  IF v_user IS NULL THEN
    RETURN QUERY SELECT false, 0;
    RETURN;
  END IF;

  v_award := public.apply_tier_multiplier(v_user.points, p_bonus);

  UPDATE public.storybuilders_waitlist
  SET points = points + v_award
  WHERE id = v_user.id;

  RETURN QUERY SELECT true, v_user.points + v_award;
END;
$$;