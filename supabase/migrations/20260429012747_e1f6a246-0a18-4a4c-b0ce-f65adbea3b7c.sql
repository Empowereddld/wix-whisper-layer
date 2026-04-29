ALTER TABLE public.storybuilders_waitlist
  ADD COLUMN IF NOT EXISTS role text,
  ADD COLUMN IF NOT EXISTS role_other text;

ALTER TABLE public.storybuilders_waitlist
  DROP CONSTRAINT IF EXISTS storybuilders_waitlist_role_check;

ALTER TABLE public.storybuilders_waitlist
  ADD CONSTRAINT storybuilders_waitlist_role_check
  CHECK (role IS NULL OR role IN ('parent', 'speech_pro', 'other'));