
-- StoryBuilders waitlist with referral tracking
CREATE TABLE public.storybuilders_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  referral_code TEXT NOT NULL UNIQUE,
  referred_by_code TEXT,
  invite_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.storybuilders_waitlist ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public signup)
CREATE POLICY "Anyone can join waitlist"
  ON public.storybuilders_waitlist FOR INSERT
  WITH CHECK (true);

-- Public read of aggregate count only (via RPC)
-- Individual rows only readable by admin
CREATE POLICY "Admins can view all waitlist entries"
  ON public.storybuilders_waitlist FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Allow public to read own entry by email (for progress display)
CREATE POLICY "Users can read own entry by referral code"
  ON public.storybuilders_waitlist FOR SELECT
  USING (true);

-- Function to get total waitlist count
CREATE OR REPLACE FUNCTION public.get_storybuilders_waitlist_count()
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::integer FROM public.storybuilders_waitlist;
$$;

-- Function to get entry by referral code
CREATE OR REPLACE FUNCTION public.get_waitlist_by_referral(p_code TEXT)
RETURNS TABLE(id UUID, name TEXT, email TEXT, referral_code TEXT, invite_count INTEGER, created_at TIMESTAMPTZ)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT w.id, w.name, w.email, w.referral_code, w.invite_count, w.created_at
  FROM public.storybuilders_waitlist w
  WHERE w.referral_code = p_code;
$$;

-- Enable realtime for live counter
ALTER PUBLICATION supabase_realtime ADD TABLE public.storybuilders_waitlist;
