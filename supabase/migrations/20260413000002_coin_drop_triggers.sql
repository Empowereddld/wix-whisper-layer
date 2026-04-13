-- Award automatic coin drops at tier promotion and optimize position recalculation
-- Date: 2026-04-13

-- Replace award_waitlist_points RPC to:
-- 1. Award coins when promoting to Tier 2 (75 coins) or Tier 4 (200 coins)
-- 2. Only recalculate positions when tier actually changes
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
  v_coin_award INTEGER;
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

  -- Update tier if promoted and award coins
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

    -- Award coins for tier promotions
    v_coin_award := CASE v_new_tier
      WHEN 2 THEN 75   -- Tier 2 (Champion): 75 coins
      WHEN 4 THEN 200  -- Tier 4 (Legend): 200 coins
      ELSE 0
    END;

    IF v_coin_award > 0 THEN
      PERFORM public.award_story_coins(p_email, v_coin_award, 'tier_promotion_tier_' || v_new_tier);
    END IF;

    -- Recalculate positions only when tier changes
    PERFORM public.recalculate_waitlist_positions();
  END IF;

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
