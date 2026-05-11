
-- Replace submit_waitlist_suggestion: single text body, 280-char limit, still gated at Tier 4
DROP FUNCTION IF EXISTS public.submit_waitlist_suggestion(text, text, text, text, integer);
DROP FUNCTION IF EXISTS public.submit_waitlist_suggestion(text, text, text, integer);

CREATE OR REPLACE FUNCTION public.submit_waitlist_suggestion(
  p_referral_code text,
  p_text text,
  p_category text,
  p_points integer
)
RETURNS TABLE(success boolean, suggestion_id uuid, new_points integer, message text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_user RECORD;
  v_new_id uuid;
  v_text text;
  v_title text;
BEGIN
  v_text := trim(coalesce(p_text, ''));

  IF length(v_text) < 3 THEN
    RETURN QUERY SELECT false, NULL::uuid, 0, 'Suggestion is too short'::text;
    RETURN;
  END IF;

  IF length(v_text) > 280 THEN
    RETURN QUERY SELECT false, NULL::uuid, 0, 'Suggestion must be 280 characters or fewer'::text;
    RETURN;
  END IF;

  SELECT id, points
  INTO v_user
  FROM public.storybuilders_waitlist
  WHERE referral_code = p_referral_code
  FOR UPDATE;

  IF v_user IS NULL THEN
    RETURN QUERY SELECT false, NULL::uuid, 0, 'User not found'::text;
    RETURN;
  END IF;

  -- Tier 4 = 130 points threshold
  IF v_user.points < 130 THEN
    RETURN QUERY SELECT false, NULL::uuid, v_user.points, 'Tier 4 required to submit suggestions'::text;
    RETURN;
  END IF;

  -- Title is derived from the text (used for admin Kanban headline)
  v_title := left(v_text, 80);

  INSERT INTO public.waitlist_suggestions (waitlist_id, title, description, category)
  VALUES (v_user.id, v_title, v_text, COALESCE(p_category, 'general'))
  RETURNING id INTO v_new_id;

  -- Award points (default 0 if not passed)
  IF COALESCE(p_points, 0) > 0 THEN
    UPDATE public.storybuilders_waitlist
    SET points = points + p_points
    WHERE id = v_user.id;
  END IF;

  RETURN QUERY SELECT true, v_new_id, v_user.points + COALESCE(p_points, 0), 'Suggestion submitted'::text;
END;
$function$;

-- Return the suggestion_ids that this waitlist user (by referral_code) has already voted on
CREATE OR REPLACE FUNCTION public.get_user_voted_suggestions(p_referral_code text)
RETURNS TABLE(suggestion_id uuid)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT v.suggestion_id
  FROM public.waitlist_suggestion_votes v
  JOIN public.storybuilders_waitlist w ON w.id = v.waitlist_id
  WHERE w.referral_code = p_referral_code;
$function$;
