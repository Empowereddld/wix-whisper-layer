-- Streak and daily check-in system for Story Pros waitlist
-- Date: 2026-04-13

-- 1. Add last_checkin_at column to storybuilders_waitlist
ALTER TABLE public.storybuilders_waitlist
ADD COLUMN IF NOT EXISTS last_checkin_at TIMESTAMPTZ DEFAULT NULL;

-- 2. Create index for daily check-in queries
CREATE INDEX IF NOT EXISTS idx_waitlist_last_checkin_at ON public.storybuilders_waitlist(last_checkin_at DESC);

-- 3. RPC: Daily check-in function
CREATE OR REPLACE FUNCTION public.daily_checkin(p_email TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user RECORD;
  v_already_checked_in BOOLEAN;
  v_new_streak INTEGER;
  v_points_awarded INTEGER;
  v_bonus_points INTEGER;
  v_bonus_message TEXT;
  v_result JSON;
  v_yesterday TIMESTAMPTZ;
BEGIN
  -- Get user data
  SELECT id, email, last_checkin_at, streak_days, points
  INTO v_user
  FROM public.storybuilders_waitlist
  WHERE email = p_email;

  IF v_user IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'User not found');
  END IF;

  -- Check if already checked in today (comparing date part only)
  v_already_checked_in := (
    v_user.last_checkin_at IS NOT NULL
    AND DATE(v_user.last_checkin_at) = CURRENT_DATE
  );

  IF v_already_checked_in THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Already checked in today'
    );
  END IF;

  -- Calculate new streak
  v_yesterday := CURRENT_DATE - INTERVAL '1 day';

  IF v_user.last_checkin_at IS NULL THEN
    -- First check-in ever
    v_new_streak := 1;
  ELSIF DATE(v_user.last_checkin_at) = v_yesterday::date THEN
    -- Checked in yesterday, increment streak
    v_new_streak := v_user.streak_days + 1;
  ELSE
    -- Gap in check-ins, reset streak
    v_new_streak := 1;
  END IF;

  -- Update last_checkin_at and streak_days
  UPDATE public.storybuilders_waitlist
  SET last_checkin_at = NOW(), streak_days = v_new_streak
  WHERE email = p_email;

  -- Award base points (2 points for daily check-in)
  v_points_awarded := 2;

  PERFORM public.award_waitlist_points(
    p_email,
    v_points_awarded,
    'daily_checkin',
    json_build_object('streak_days', v_new_streak)::jsonb
  );

  -- Check for streak bonuses and award bonus points
  v_bonus_points := 0;
  v_bonus_message := '';

  IF v_new_streak = 3 THEN
    v_bonus_points := 3;
    v_bonus_message := 'Streak bonus: 3-day streak!';
  ELSIF v_new_streak = 7 THEN
    v_bonus_points := 10;
    v_bonus_message := 'Streak bonus: 7-day streak!';
  ELSIF v_new_streak = 14 THEN
    v_bonus_points := 20;
    v_bonus_message := 'Streak bonus: 14-day streak!';
  ELSIF v_new_streak = 30 THEN
    v_bonus_points := 50;
    v_bonus_message := 'Streak bonus: 30-day streak!';
  END IF;

  -- Award bonus points if any
  IF v_bonus_points > 0 THEN
    PERFORM public.award_waitlist_points(
      p_email,
      v_bonus_points,
      'streak_bonus',
      json_build_object(
        'streak_days', v_new_streak,
        'bonus_message', v_bonus_message
      )::jsonb
    );
  END IF;

  -- Log the check-in event
  INSERT INTO public.waitlist_events (user_email, event_type, points_awarded, metadata)
  VALUES (
    p_email,
    'daily_checkin',
    v_points_awarded + v_bonus_points,
    json_build_object(
      'streak_days', v_new_streak,
      'base_points', v_points_awarded,
      'bonus_points', v_bonus_points,
      'bonus_message', v_bonus_message
    )::jsonb
  );

  -- Build result
  SELECT json_build_object(
    'success', true,
    'streak_days', v_new_streak,
    'points_awarded', v_points_awarded + v_bonus_points,
    'bonus', v_bonus_points,
    'bonus_message', v_bonus_message
  ) INTO v_result;

  RETURN v_result;
END;
$$;
