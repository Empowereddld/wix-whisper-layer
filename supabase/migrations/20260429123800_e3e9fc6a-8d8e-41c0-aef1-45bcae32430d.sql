-- Add rewards_claimed JSONB column to track which tier rewards each user has claimed
ALTER TABLE public.storybuilders_waitlist
ADD COLUMN IF NOT EXISTS rewards_claimed jsonb NOT NULL DEFAULT '{}'::jsonb;

-- Tier reward thresholds (must match src/lib/waitlist-constants.ts)
-- tier_1_founding (tier 1, 0 pts), tier_2_ef_guide (tier 2, 35 pts), tier_3_coins (tier 3, 75 pts),
-- tier_4_beta (tier 4, 130 pts), tier_5_founder_price (tier 5, 250 pts), tier_6_elite (tier 6, 500 pts)
CREATE OR REPLACE FUNCTION public.claim_waitlist_reward(
  p_referral_code text,
  p_reward_id text
)
RETURNS TABLE(success boolean, already_claimed boolean, message text, claimed_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_record RECORD;
  v_required_points integer;
  v_now timestamptz := now();
BEGIN
  -- Map reward_id to required points threshold
  v_required_points := CASE p_reward_id
    WHEN 'tier_1_founding'      THEN 0
    WHEN 'tier_2_ef_guide'      THEN 35
    WHEN 'tier_3_coins'         THEN 75
    WHEN 'tier_4_beta'          THEN 130
    WHEN 'tier_5_founder_price' THEN 250
    WHEN 'tier_6_elite'         THEN 500
    ELSE NULL
  END;

  IF v_required_points IS NULL THEN
    RETURN QUERY SELECT false, false, 'Unknown reward'::text, NULL::timestamptz;
    RETURN;
  END IF;

  SELECT id, points, rewards_claimed, email_verified
  INTO v_record
  FROM public.storybuilders_waitlist
  WHERE referral_code = p_referral_code
  FOR UPDATE;

  IF v_record IS NULL THEN
    RETURN QUERY SELECT false, false, 'User not found'::text, NULL::timestamptz;
    RETURN;
  END IF;

  IF NOT v_record.email_verified THEN
    RETURN QUERY SELECT false, false, 'Verify your email first'::text, NULL::timestamptz;
    RETURN;
  END IF;

  IF v_record.points < v_required_points THEN
    RETURN QUERY SELECT false, false, 'Reward not unlocked yet'::text, NULL::timestamptz;
    RETURN;
  END IF;

  -- Already claimed?
  IF v_record.rewards_claimed ? p_reward_id THEN
    RETURN QUERY SELECT true, true,
      'Already claimed'::text,
      ((v_record.rewards_claimed -> p_reward_id) ->> 'claimed_at')::timestamptz;
    RETURN;
  END IF;

  UPDATE public.storybuilders_waitlist
  SET rewards_claimed = rewards_claimed || jsonb_build_object(
    p_reward_id, jsonb_build_object('claimed_at', v_now)
  )
  WHERE id = v_record.id;

  RETURN QUERY SELECT true, false, 'Claimed'::text, v_now;
END;
$$;