
-- Add is_published to resources table
ALTER TABLE public.resources
  ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT true;

-- Add welcome_dismissed to profiles table  
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS welcome_dismissed boolean NOT NULL DEFAULT false;
