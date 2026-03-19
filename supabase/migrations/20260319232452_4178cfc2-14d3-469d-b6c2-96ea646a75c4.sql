
-- Function to increment invite count for a referrer
CREATE OR REPLACE FUNCTION public.increment_waitlist_invites(p_code TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.storybuilders_waitlist
  SET invite_count = invite_count + 1
  WHERE referral_code = p_code;
END;
$$;
