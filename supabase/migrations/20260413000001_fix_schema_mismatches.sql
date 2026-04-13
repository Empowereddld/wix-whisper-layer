-- Fix schema mismatches in Story Pros waitlist system
-- Date: 2026-04-13

-- 1. Add missing fraud_risk_score column to storybuilders_waitlist
ALTER TABLE public.storybuilders_waitlist
ADD COLUMN IF NOT EXISTS fraud_risk_score INTEGER DEFAULT 0;

-- 2. Fix waitlist_fraud_log table to have correct columns for check-fraud function
-- Drop existing columns that are wrong and add correct ones
ALTER TABLE public.waitlist_fraud_log
ADD COLUMN IF NOT EXISTS risk_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS fraud_reasons TEXT[] DEFAULT '{}';

-- 3. Add missing indexes for performance
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.storybuilders_waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_referral_code ON public.storybuilders_waitlist(referral_code);
CREATE INDEX IF NOT EXISTS idx_waitlist_events_created_at ON public.waitlist_events(created_at DESC);

-- 4. Update award_waitlist_points RPC with correct tier thresholds
-- Old thresholds: 35/85/135/260/510
-- New thresholds: 40/100/175/325/600
CREATE OR REPLACE FUNCTION public.award_waitlist_points(
  p_email TEXT,
  p_points INTEGER,
  p_event_type TEXT,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_points INTEGER;
  v_old_tier INTEGER;
  v_new_tier INTEGER;
  v_tier_name TEXT;
  v_result JSON;
BEGIN
  -- Award points
  UPDATE public.storybuilders_waitlist
  SET points = points + p_points, last_active_at = now()
  WHERE email = p_email
  RETURNING points, current_tier INTO v_new_points, v_old_tier;

  -- Log event
  INSERT INTO public.waitlist_events (user_email, event_type, points_awarded, metadata)
  VALUES (p_email, p_event_type, p_points, p_metadata);

  -- Calculate new tier based on points (updated thresholds)
  v_new_tier := CASE
    WHEN v_new_points >= 600 THEN 5  -- Founding Elite (20 refs)
    WHEN v_new_points >= 325 THEN 4  -- Legend (10 refs)
    WHEN v_new_points >= 175 THEN 3  -- Hero (5 refs)
    WHEN v_new_points >= 100 THEN 2  -- Champion (3 refs)
    WHEN v_new_points >= 40 THEN 1   -- Advocate (1 ref)
    ELSE 0                            -- Storyteller
  END;

  -- Update tier if promoted
  IF v_new_tier > v_old_tier THEN
    v_tier_name := CASE v_new_tier
      WHEN 1 THEN 'Advocate'
      WHEN 2 THEN 'Champion'
      WHEN 3 THEN 'Hero'
      WHEN 4 THEN 'Legend'
      WHEN 5 THEN 'Founding Elite'
      ELSE 'Storyteller'
    END;

    UPDATE public.storybuilders_waitlist SET current_tier = v_new_tier WHERE email = p_email;

    INSERT INTO public.waitlist_milestones (user_email, tier_id, tier_name)
    VALUES (p_email, v_new_tier, v_tier_name)
    ON CONFLICT (user_email, tier_id) DO NOTHING;

    INSERT INTO public.waitlist_events (user_email, event_type, metadata)
    VALUES (p_email, 'milestone_reached', json_build_object('tier_id', v_new_tier, 'tier_name', v_tier_name)::jsonb);
  END IF;

  -- Recalculate positions
  PERFORM public.recalculate_waitlist_positions();

  SELECT json_build_object(
    'new_points', v_new_points,
    'new_tier', v_new_tier,
    'old_tier', v_old_tier,
    'promoted', v_new_tier > v_old_tier,
    'tier_name', CASE v_new_tier
      WHEN 0 THEN 'Storyteller' WHEN 1 THEN 'Advocate' WHEN 2 THEN 'Champion'
      WHEN 3 THEN 'Hero' WHEN 4 THEN 'Legend' WHEN 5 THEN 'Founding Elite'
    END
  ) INTO v_result;

  RETURN v_result;
END;
$$;

-- 5. Fix coin system RPCs to use user_email instead of waitlist_id
-- (since waitlist_events uses user_email column, not waitlist_id)
CREATE OR REPLACE FUNCTION public.award_story_coins(p_email TEXT, p_coins INTEGER, p_reason TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_coins INTEGER;
BEGIN
  UPDATE public.storybuilders_waitlist
  SET coins = coins + p_coins
  WHERE email = p_email
  RETURNING coins INTO v_new_coins;

  -- Log the event
  INSERT INTO public.waitlist_events (user_email, event_type, metadata)
  VALUES (p_email, 'coins_earned', jsonb_build_object('amount', p_coins, 'reason', p_reason, 'new_total', v_new_coins));

  RETURN v_new_coins;
END;
$$;

CREATE OR REPLACE FUNCTION public.claim_waitlist_reward(p_email TEXT, p_reward_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.storybuilders_waitlist
  SET inventory = inventory || jsonb_build_object(p_reward_id, jsonb_build_object('claimed', true, 'claimedAt', now()::text))
  WHERE email = p_email;

  INSERT INTO public.waitlist_events (user_email, event_type, metadata)
  VALUES (p_email, 'reward_claimed', jsonb_build_object('reward_id', p_reward_id));

  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.redeem_coin_pack(p_email TEXT, p_pack_level INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_cost INTEGER;
  v_current_coins INTEGER;
BEGIN
  v_cost := CASE WHEN p_pack_level = 1 THEN 50 WHEN p_pack_level = 2 THEN 150 ELSE 0 END;

  SELECT coins INTO v_current_coins FROM public.storybuilders_waitlist WHERE email = p_email;

  IF v_current_coins < v_cost THEN
    RETURN false;
  END IF;

  UPDATE public.storybuilders_waitlist
  SET coins = coins - v_cost,
      coin_pack_1_claimed = CASE WHEN p_pack_level = 1 THEN true ELSE coin_pack_1_claimed END,
      coin_pack_2_claimed = CASE WHEN p_pack_level = 2 THEN true ELSE coin_pack_2_claimed END
  WHERE email = p_email;

  INSERT INTO public.waitlist_events (user_email, event_type, metadata)
  VALUES (p_email, 'coin_pack_redeemed', jsonb_build_object('pack_level', p_pack_level, 'cost', v_cost));

  RETURN true;
END;
$$;
