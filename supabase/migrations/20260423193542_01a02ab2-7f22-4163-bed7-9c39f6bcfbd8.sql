
-- Add points, social claims, and SLP/speech-professional fields to the waitlist
ALTER TABLE public.storybuilders_waitlist
  ADD COLUMN IF NOT EXISTS points integer NOT NULL DEFAULT 10,
  ADD COLUMN IF NOT EXISTS is_speech_professional boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS speech_professional_verified boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS social_claims jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS share_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS click_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS shares_today integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS clicks_today integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_share_date date,
  ADD COLUMN IF NOT EXISTS last_click_date date,
  ADD COLUMN IF NOT EXISTS first_share_bonus_awarded boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS first_referral_bonus_awarded boolean NOT NULL DEFAULT false;

-- Track referral clicks for IP/day rate limiting (1 point per IP per referrer per day)
CREATE TABLE IF NOT EXISTS public.referral_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_code text NOT NULL,
  ip_address text NOT NULL,
  click_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (referral_code, ip_address, click_date)
);

ALTER TABLE public.referral_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view referral clicks"
  ON public.referral_clicks FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Atomic function: claim a social follow (one-time per platform per user)
CREATE OR REPLACE FUNCTION public.claim_social_follow(
  p_referral_code text,
  p_platform text,
  p_points integer
)
RETURNS TABLE(success boolean, already_claimed boolean, new_points integer, message text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_record RECORD;
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

  UPDATE public.storybuilders_waitlist
  SET points = points + p_points,
      social_claims = social_claims || jsonb_build_object(
        p_platform, jsonb_build_object('claimed_at', now(), 'points', p_points)
      )
  WHERE id = v_record.id;

  RETURN QUERY SELECT true, false, v_record.points + p_points, 'Points awarded'::text;
END;
$$;

-- Atomic function: record a share and award points (with daily cap)
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
SET search_path = public
AS $$
DECLARE
  v_record RECORD;
  v_today date := CURRENT_DATE;
  v_shares_today integer;
  v_award integer := 0;
  v_first_bonus integer := 0;
BEGIN
  SELECT id, points, share_count, shares_today, last_share_date, first_share_bonus_awarded
  INTO v_record
  FROM public.storybuilders_waitlist
  WHERE referral_code = p_referral_code
  FOR UPDATE;

  IF v_record IS NULL THEN
    RETURN QUERY SELECT false, 0, 0, false;
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
      first_share_bonus_awarded = true
  WHERE id = v_record.id;

  RETURN QUERY SELECT true, v_award + v_first_bonus, v_record.points + v_award + v_first_bonus, false;
END;
$$;

-- Atomic function: record a referral click (1 pt per unique IP per referrer per day)
CREATE OR REPLACE FUNCTION public.record_referral_click(
  p_referral_code text,
  p_ip_address text,
  p_points integer,
  p_daily_cap integer
)
RETURNS TABLE(success boolean, awarded boolean, reason text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_record RECORD;
  v_today date := CURRENT_DATE;
  v_clicks_today integer;
  v_inserted boolean := false;
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

  -- Try to insert IP/day record; if conflict, this IP already counted today
  BEGIN
    INSERT INTO public.referral_clicks (referral_code, ip_address, click_date)
    VALUES (p_referral_code, p_ip_address, v_today);
    v_inserted := true;
  EXCEPTION WHEN unique_violation THEN
    v_inserted := false;
  END;

  IF NOT v_inserted THEN
    RETURN QUERY SELECT true, false, 'IP already counted today'::text;
    RETURN;
  END IF;

  -- Reset daily counter if new day
  IF v_record.last_click_date IS NULL OR v_record.last_click_date <> v_today THEN
    v_clicks_today := 0;
  ELSE
    v_clicks_today := v_record.clicks_today;
  END IF;

  -- Check daily cap (in points)
  IF (v_clicks_today * p_points) >= p_daily_cap THEN
    UPDATE public.storybuilders_waitlist
    SET click_count = click_count + 1,
        clicks_today = v_clicks_today + 1,
        last_click_date = v_today
    WHERE id = v_record.id;
    RETURN QUERY SELECT true, false, 'Daily cap reached'::text;
    RETURN;
  END IF;

  UPDATE public.storybuilders_waitlist
  SET points = points + p_points,
      click_count = click_count + 1,
      clicks_today = v_clicks_today + 1,
      last_click_date = v_today
  WHERE id = v_record.id;

  RETURN QUERY SELECT true, true, 'Point awarded'::text;
END;
$$;

-- Admin: verify a speech-language professional and award the +50 bonus
CREATE OR REPLACE FUNCTION public.verify_speech_professional(p_waitlist_id uuid, p_bonus integer)
RETURNS TABLE(success boolean, new_points integer, message text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;
