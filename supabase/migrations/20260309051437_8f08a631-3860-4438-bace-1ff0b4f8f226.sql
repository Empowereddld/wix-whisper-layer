
-- Add referred_by to profiles for referral tracking
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS referred_by text;
