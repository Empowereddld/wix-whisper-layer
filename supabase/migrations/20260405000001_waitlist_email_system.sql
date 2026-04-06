-- Email log table
CREATE TABLE public.waitlist_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email TEXT NOT NULL,
  template TEXT NOT NULL,
  subject TEXT,
  resend_id TEXT,
  status TEXT DEFAULT 'sent',
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.waitlist_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view emails" ON public.waitlist_emails FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Service can insert emails" ON public.waitlist_emails FOR INSERT WITH CHECK (true);
CREATE POLICY "Service can update emails" ON public.waitlist_emails FOR UPDATE USING (true);

-- Add new columns to existing waitlist table
ALTER TABLE public.storybuilders_waitlist
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS verification_token TEXT,
  ADD COLUMN IF NOT EXISTS verification_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS ip_address INET,
  ADD COLUMN IF NOT EXISTS fraud_flagged BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS fraud_reason TEXT,
  ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS queue_position INTEGER,
  ADD COLUMN IF NOT EXISTS current_tier INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS share_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS click_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ DEFAULT now(),
  ADD COLUMN IF NOT EXISTS streak_days INTEGER DEFAULT 0;

-- Events table for tracking all actions
CREATE TABLE public.waitlist_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  event_type TEXT NOT NULL,
  points_awarded INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.waitlist_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view events" ON public.waitlist_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Service can insert events" ON public.waitlist_events FOR INSERT WITH CHECK (true);

CREATE INDEX idx_events_email ON public.waitlist_events(user_email);
CREATE INDEX idx_events_type ON public.waitlist_events(event_type);
CREATE INDEX idx_waitlist_points ON public.storybuilders_waitlist(points DESC);
CREATE INDEX idx_waitlist_position ON public.storybuilders_waitlist(queue_position ASC);

-- Milestones table
CREATE TABLE public.waitlist_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  tier_id INTEGER NOT NULL,
  tier_name TEXT NOT NULL,
  reward_delivered BOOLEAN DEFAULT false,
  delivery_data JSONB DEFAULT '{}',
  claimed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_email, tier_id)
);

ALTER TABLE public.waitlist_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view milestones" ON public.waitlist_milestones FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Service can insert milestones" ON public.waitlist_milestones FOR INSERT WITH CHECK (true);
CREATE POLICY "Service can update milestones" ON public.waitlist_milestones FOR UPDATE USING (true);
CREATE POLICY "Users can read own milestones" ON public.waitlist_milestones FOR SELECT USING (true);

-- Fraud log table
CREATE TABLE public.waitlist_fraud_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  reason TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.waitlist_fraud_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view fraud log" ON public.waitlist_fraud_log FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Service can insert fraud log" ON public.waitlist_fraud_log FOR INSERT WITH CHECK (true);

CREATE INDEX idx_fraud_log_ip ON public.waitlist_fraud_log(ip_address);
CREATE INDEX idx_fraud_log_email ON public.waitlist_fraud_log(email);

-- Suggestions table (for Tier 3+ users)
CREATE TABLE public.waitlist_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  user_name TEXT,
  topic TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'new',
  vote_count INTEGER DEFAULT 0,
  admin_response TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.waitlist_suggestions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage suggestions" ON public.waitlist_suggestions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Public can insert suggestions" ON public.waitlist_suggestions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read suggestions" ON public.waitlist_suggestions FOR SELECT USING (true);

-- Suggestion votes
CREATE TABLE public.waitlist_suggestion_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  suggestion_id UUID NOT NULL REFERENCES public.waitlist_suggestions(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(suggestion_id, user_email)
);

ALTER TABLE public.waitlist_suggestion_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can vote" ON public.waitlist_suggestion_votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read votes" ON public.waitlist_suggestion_votes FOR SELECT USING (true);

-- Badges table
CREATE TABLE public.waitlist_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  badge_id TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_email, badge_id)
);

ALTER TABLE public.waitlist_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read badges" ON public.waitlist_badges FOR SELECT USING (true);
CREATE POLICY "Service can insert badges" ON public.waitlist_badges FOR INSERT WITH CHECK (true);

-- RPC: Get leaderboard
CREATE OR REPLACE FUNCTION public.get_waitlist_leaderboard(limit_count INTEGER DEFAULT 10)
RETURNS TABLE(
  display_name TEXT,
  points INTEGER,
  current_tier INTEGER,
  invite_count INTEGER,
  queue_position INTEGER,
  created_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    CONCAT(split_part(w.name, ' ', 1), ' ', LEFT(split_part(w.name, ' ', 2), 1), '.') as display_name,
    w.points,
    w.current_tier,
    w.invite_count,
    w.queue_position,
    w.created_at
  FROM public.storybuilders_waitlist w
  WHERE w.email_verified = true OR w.points > 0
  ORDER BY w.points DESC, w.created_at ASC
  LIMIT limit_count;
$$;

-- RPC: Get user position and stats
CREATE OR REPLACE FUNCTION public.get_waitlist_user_stats(p_email TEXT)
RETURNS TABLE(
  queue_position INTEGER,
  total_users INTEGER,
  points INTEGER,
  current_tier INTEGER,
  invite_count INTEGER,
  share_count INTEGER,
  click_count INTEGER,
  streak_days INTEGER,
  email_verified BOOLEAN
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    w.queue_position,
    (SELECT COUNT(*)::integer FROM public.storybuilders_waitlist),
    w.points,
    w.current_tier,
    w.invite_count,
    w.share_count,
    w.click_count,
    w.streak_days,
    w.email_verified
  FROM public.storybuilders_waitlist w
  WHERE w.email = p_email;
$$;

-- RPC: Get recent signup count (for social proof)
CREATE OR REPLACE FUNCTION public.get_recent_waitlist_signups(hours_ago INTEGER DEFAULT 24)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::integer
  FROM public.storybuilders_waitlist
  WHERE created_at > now() - (hours_ago || ' hours')::interval;
$$;

-- RPC: Get recent activity feed
CREATE OR REPLACE FUNCTION public.get_waitlist_activity(limit_count INTEGER DEFAULT 20)
RETURNS TABLE(
  event_type TEXT,
  display_name TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    e.event_type,
    CONCAT(split_part(w.name, ' ', 1), ' ', LEFT(split_part(w.name, ' ', 2), 1), '.') as display_name,
    e.metadata,
    e.created_at
  FROM public.waitlist_events e
  LEFT JOIN public.storybuilders_waitlist w ON w.email = e.user_email
  WHERE e.event_type IN ('signup', 'milestone_reached', 'referral_convert', 'badge_earned')
  ORDER BY e.created_at DESC
  LIMIT limit_count;
$$;

-- RPC: Get analytics for admin
CREATE OR REPLACE FUNCTION public.get_waitlist_analytics()
RETURNS JSON
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_signups', (SELECT COUNT(*) FROM public.storybuilders_waitlist),
    'verified_count', (SELECT COUNT(*) FROM public.storybuilders_waitlist WHERE email_verified = true),
    'total_referrals', (SELECT COALESCE(SUM(invite_count), 0) FROM public.storybuilders_waitlist),
    'total_shares', (SELECT COALESCE(SUM(share_count), 0) FROM public.storybuilders_waitlist),
    'fraud_flagged', (SELECT COUNT(*) FROM public.storybuilders_waitlist WHERE fraud_flagged = true),
    'tier_distribution', (
      SELECT json_agg(row_to_json(t)) FROM (
        SELECT current_tier, COUNT(*) as count
        FROM public.storybuilders_waitlist
        GROUP BY current_tier ORDER BY current_tier
      ) t
    ),
    'signups_today', (SELECT COUNT(*) FROM public.storybuilders_waitlist WHERE created_at > CURRENT_DATE),
    'signups_this_week', (SELECT COUNT(*) FROM public.storybuilders_waitlist WHERE created_at > CURRENT_DATE - INTERVAL '7 days'),
    'avg_referrals_per_user', (SELECT COALESCE(AVG(invite_count), 0) FROM public.storybuilders_waitlist WHERE invite_count > 0),
    'founder_spots_claimed', (SELECT COUNT(*) FROM public.waitlist_milestones WHERE tier_id >= 4),
    'top_referrer_count', (SELECT COALESCE(MAX(invite_count), 0) FROM public.storybuilders_waitlist)
  ) INTO result;
  RETURN result;
END;
$$;

-- RPC: Recalculate all positions
CREATE OR REPLACE FUNCTION public.recalculate_waitlist_positions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  WITH ranked AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY points DESC, created_at ASC) as new_position
    FROM public.storybuilders_waitlist
  )
  UPDATE public.storybuilders_waitlist w
  SET queue_position = r.new_position
  FROM ranked r
  WHERE w.id = r.id AND (w.queue_position IS NULL OR w.queue_position != r.new_position);
END;
$$;

-- RPC: Award points and check tier promotion
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

  -- Calculate new tier based on points
  v_new_tier := CASE
    WHEN v_new_points >= 510 THEN 5  -- Founding Elite (20 refs)
    WHEN v_new_points >= 260 THEN 4  -- Legend (10 refs)
    WHEN v_new_points >= 135 THEN 3  -- Hero (5 refs)
    WHEN v_new_points >= 85 THEN 2   -- Champion (3 refs)
    WHEN v_new_points >= 35 THEN 1   -- Advocate (1 ref)
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
