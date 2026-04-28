-- One-time normalization: lowercase all emails in storybuilders_waitlist.
-- Case-only duplicates (where lower(email) collides) keep the most recently
-- created row at the canonical lowercase email; older duplicates get a
-- ".dup-collision-<id>" suffix so admins can review and merge manually.
-- Soft-deleted rows (deleted_at IS NOT NULL) are excluded from collision
-- detection because their emails were already suffixed by the soft-delete RPC.

DO $$
DECLARE
  collision RECORD;
  keeper_id uuid;
  loser RECORD;
BEGIN
  FOR collision IN
    SELECT lower(email) AS lc_email, COUNT(*) AS n
    FROM public.storybuilders_waitlist
    WHERE deleted_at IS NULL
    GROUP BY lower(email)
    HAVING COUNT(*) > 1
  LOOP
    SELECT id INTO keeper_id
    FROM public.storybuilders_waitlist
    WHERE deleted_at IS NULL AND lower(email) = collision.lc_email
    ORDER BY created_at DESC, id
    LIMIT 1;

    FOR loser IN
      SELECT id, email
      FROM public.storybuilders_waitlist
      WHERE deleted_at IS NULL
        AND lower(email) = collision.lc_email
        AND id <> keeper_id
    LOOP
      UPDATE public.storybuilders_waitlist
      SET email = collision.lc_email || '.dup-collision-' || loser.id::text
      WHERE id = loser.id;

      INSERT INTO public.audit_logs (admin_id, action)
      VALUES (NULL, 'email_normalization_collision:' || loser.email || '->' || collision.lc_email || '.dup-collision-' || loser.id::text);
    END LOOP;
  END LOOP;
END $$;

-- Now safely lowercase all remaining (non-soft-deleted) emails.
UPDATE public.storybuilders_waitlist
SET email = lower(email)
WHERE deleted_at IS NULL
  AND email <> lower(email);