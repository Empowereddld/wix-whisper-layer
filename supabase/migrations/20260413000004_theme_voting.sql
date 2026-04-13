-- Story Theme Voting System
-- Date: 2026-04-13

-- Create story_themes table
CREATE TABLE IF NOT EXISTS public.story_themes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  emoji TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create story_theme_votes table
CREATE TABLE IF NOT EXISTS public.story_theme_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  theme_id TEXT NOT NULL REFERENCES public.story_themes(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create unique constraint so users can only vote once per theme
CREATE UNIQUE INDEX IF NOT EXISTS idx_story_theme_votes_unique
  ON public.story_theme_votes(theme_id, user_email);

-- Create index for vote queries
CREATE INDEX IF NOT EXISTS idx_story_theme_votes_theme
  ON public.story_theme_votes(theme_id);

-- Seed initial themes
INSERT INTO public.story_themes (id, title, description, emoji, active)
VALUES
  ('adventure', 'Adventure Quest', 'Dan and Daria explore a magical forest, learning new words along the way', '🌲', true),
  ('space', 'Space Explorers', 'A journey through the solar system where every planet teaches a new skill', '🚀', true),
  ('ocean', 'Ocean Discovery', 'Underwater adventures helping sea creatures communicate and solve problems', '🌊', true),
  ('garden', 'Secret Garden', 'Growing a magical garden where each plant represents a different emotion', '🌻', true),
  ('music', 'Rhythm & Words', 'A musical adventure where sounds and words come together to tell stories', '🎵', true)
ON CONFLICT (id) DO NOTHING;

-- RPC: Cast a theme vote
CREATE OR REPLACE FUNCTION public.cast_theme_vote(
  p_email TEXT,
  p_theme_id TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSON;
  v_vote_id UUID;
BEGIN
  -- Check if theme exists and is active
  IF NOT EXISTS (SELECT 1 FROM public.story_themes WHERE id = p_theme_id AND active = true) THEN
    RETURN json_build_object('success', false, 'error', 'Theme not found or inactive');
  END IF;

  -- Check if user already voted for this theme
  IF EXISTS (SELECT 1 FROM public.story_theme_votes WHERE user_email = p_email AND theme_id = p_theme_id) THEN
    RETURN json_build_object('success', false, 'error', 'You have already voted for this theme');
  END IF;

  -- Insert vote
  INSERT INTO public.story_theme_votes (theme_id, user_email)
  VALUES (p_theme_id, p_email)
  RETURNING id INTO v_vote_id;

  RETURN json_build_object('success', true, 'vote_id', v_vote_id);
END;
$$;

-- RPC: Get theme voting results
CREATE OR REPLACE FUNCTION public.get_theme_results()
RETURNS TABLE (
  theme_id TEXT,
  title TEXT,
  emoji TEXT,
  vote_count BIGINT,
  is_active BOOLEAN
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    t.id,
    t.title,
    t.emoji,
    COALESCE(COUNT(v.id), 0) as vote_count,
    t.active
  FROM public.story_themes t
  LEFT JOIN public.story_theme_votes v ON t.id = v.theme_id
  GROUP BY t.id, t.title, t.emoji, t.active
  ORDER BY vote_count DESC;
$$;

-- RPC: Check if user has voted
CREATE OR REPLACE FUNCTION public.check_user_vote(p_email TEXT)
RETURNS TABLE (
  theme_id TEXT,
  voted_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT theme_id, created_at
  FROM public.story_theme_votes
  WHERE user_email = p_email;
$$;
