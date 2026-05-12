
ALTER TABLE public.storybuilders_waitlist
  ADD COLUMN IF NOT EXISTS last_points_earned_at timestamptz,
  ADD COLUMN IF NOT EXISTS nudge_sent_for_tier integer,
  ADD COLUMN IF NOT EXISTS founder_scarcity_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS inactivity_email_sent_at timestamptz;

-- Backfill last_points_earned_at with the most relevant existing timestamp
UPDATE public.storybuilders_waitlist
SET last_points_earned_at = COALESCE(last_share_at, verified_at, created_at)
WHERE last_points_earned_at IS NULL;

-- Trigger: bump last_points_earned_at whenever points increases
CREATE OR REPLACE FUNCTION public.update_last_points_earned_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.points IS DISTINCT FROM OLD.points AND COALESCE(NEW.points, 0) > COALESCE(OLD.points, 0) THEN
    NEW.last_points_earned_at = now();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_last_points_earned_at ON public.storybuilders_waitlist;
CREATE TRIGGER trg_update_last_points_earned_at
BEFORE UPDATE OF points ON public.storybuilders_waitlist
FOR EACH ROW
EXECUTE FUNCTION public.update_last_points_earned_at();

CREATE INDEX IF NOT EXISTS idx_waitlist_nudge_lookup
  ON public.storybuilders_waitlist (email_verified, points, last_points_earned_at)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_waitlist_inactivity_lookup
  ON public.storybuilders_waitlist (email_verified, verified_at, inactivity_email_sent_at)
  WHERE deleted_at IS NULL;
