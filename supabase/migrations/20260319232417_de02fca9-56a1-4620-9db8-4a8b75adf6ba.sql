
-- Remove overly permissive SELECT policy (RPC functions use SECURITY DEFINER)
DROP POLICY "Users can read own entry by referral code" ON public.storybuilders_waitlist;
