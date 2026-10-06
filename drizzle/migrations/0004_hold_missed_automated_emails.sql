ALTER TABLE public.storybuilders_waitlist ADD COLUMN IF NOT EXISTS automated_email_hold_at timestamptz;

-- Hold everyone who would receive a backlogged tier or nudge email when the fix deploys.
UPDATE public.storybuilders_waitlist u SET automated_email_hold_at = now()
WHERE u.email_verified AND u.deleted_at IS NULL AND (
  (u.points >= 35 AND u.email3_sent_at IS NULL)
  OR (u.points < 500 AND u.last_points_earned_at <= now() - interval '4 days'
      AND (select min(t) from unnest(array[35,75,130,250,500]) t where t > coalesce(u.points,0)) - u.points <= 15
      AND u.nudge_sent_for_tier IS DISTINCT FROM (select min(t) from unnest(array[35,75,130,250,500]) t where t > coalesce(u.points,0)))
);