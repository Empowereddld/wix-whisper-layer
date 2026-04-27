
-- Suggestions table for Tier 4+ feature board
CREATE TABLE public.waitlist_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  waitlist_id uuid NOT NULL REFERENCES public.storybuilders_waitlist(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  status text NOT NULL DEFAULT 'pending',
  vote_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.waitlist_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view suggestions"
  ON public.waitlist_suggestions FOR SELECT
  USING (true);

CREATE POLICY "Admins manage suggestions"
  ON public.waitlist_suggestions FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Votes table (one vote per waitlist member per suggestion)
CREATE TABLE public.waitlist_suggestion_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  suggestion_id uuid NOT NULL REFERENCES public.waitlist_suggestions(id) ON DELETE CASCADE,
  waitlist_id uuid NOT NULL REFERENCES public.storybuilders_waitlist(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (suggestion_id, waitlist_id)
);

ALTER TABLE public.waitlist_suggestion_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view votes"
  ON public.waitlist_suggestion_votes FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RPC: submit a suggestion (Tier 4+ enforced server-side, awards points)
CREATE OR REPLACE FUNCTION public.submit_waitlist_suggestion(
  p_referral_code text,
  p_title text,
  p_description text,
  p_category text,
  p_points integer
)
RETURNS TABLE(success boolean, suggestion_id uuid, new_points integer, message text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user RECORD;
  v_new_id uuid;
BEGIN
  IF p_title IS NULL OR length(trim(p_title)) < 3 THEN
    RETURN QUERY SELECT false, NULL::uuid, 0, 'Title is too short'::text;
    RETURN;
  END IF;

  IF p_description IS NULL OR length(trim(p_description)) < 10 THEN
    RETURN QUERY SELECT false, NULL::uuid, 0, 'Description is too short'::text;
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

  INSERT INTO public.waitlist_suggestions (waitlist_id, title, description, category)
  VALUES (v_user.id, trim(p_title), trim(p_description), COALESCE(p_category, 'general'))
  RETURNING id INTO v_new_id;

  UPDATE public.storybuilders_waitlist
  SET points = points + p_points
  WHERE id = v_user.id;

  RETURN QUERY SELECT true, v_new_id, v_user.points + p_points, 'Suggestion submitted'::text;
END;
$$;

-- RPC: vote on a suggestion
CREATE OR REPLACE FUNCTION public.vote_waitlist_suggestion(
  p_referral_code text,
  p_suggestion_id uuid
)
RETURNS TABLE(success boolean, message text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  SELECT id INTO v_user_id
  FROM public.storybuilders_waitlist
  WHERE referral_code = p_referral_code;

  IF v_user_id IS NULL THEN
    RETURN QUERY SELECT false, 'User not found'::text;
    RETURN;
  END IF;

  BEGIN
    INSERT INTO public.waitlist_suggestion_votes (suggestion_id, waitlist_id)
    VALUES (p_suggestion_id, v_user_id);
  EXCEPTION WHEN unique_violation THEN
    RETURN QUERY SELECT false, 'Already voted'::text;
    RETURN;
  END;

  UPDATE public.waitlist_suggestions
  SET vote_count = vote_count + 1
  WHERE id = p_suggestion_id;

  RETURN QUERY SELECT true, 'Vote recorded'::text;
END;
$$;

-- RPC: award referral with one-time first-referral bonus
CREATE OR REPLACE FUNCTION public.award_referral(
  p_referrer_code text,
  p_referral_points integer,
  p_first_bonus integer
)
RETURNS TABLE(success boolean, new_points integer, new_invite_count integer, first_bonus_awarded boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

  v_award := p_referral_points;
  IF NOT v_user.first_referral_bonus_awarded THEN
    v_award := v_award + p_first_bonus;
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
