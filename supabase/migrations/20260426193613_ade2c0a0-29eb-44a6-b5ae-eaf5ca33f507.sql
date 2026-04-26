ALTER TABLE public.storybuilders_waitlist
  ADD COLUMN IF NOT EXISTS email3_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS email4_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS email5_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS email6_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS email7_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS founder_slot_number integer;

CREATE UNIQUE INDEX IF NOT EXISTS storybuilders_waitlist_founder_slot_unique
  ON public.storybuilders_waitlist (founder_slot_number)
  WHERE founder_slot_number IS NOT NULL;