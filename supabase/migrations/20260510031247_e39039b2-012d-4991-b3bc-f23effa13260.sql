ALTER TABLE public.storybuilders_waitlist
  ADD COLUMN IF NOT EXISTS child_age integer,
  ADD COLUMN IF NOT EXISTS hopes text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS hopes_other text,
  ADD COLUMN IF NOT EXISTS hear_about text,
  ADD COLUMN IF NOT EXISTS profile_completed_at timestamp with time zone;