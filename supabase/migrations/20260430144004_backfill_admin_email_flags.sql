-- Backfill all email-sent timestamps for the two admin accounts so cron
-- dispatchers (email2, tier emails, verification reminders) skip them
-- going forward. This is a launch-prep cleanup, not a schema change.
UPDATE public.storybuilders_waitlist
SET email2_sent_at = COALESCE(email2_sent_at, now()),
    email3_sent_at = COALESCE(email3_sent_at, now()),
    email4_sent_at = COALESCE(email4_sent_at, now()),
    email5_sent_at = COALESCE(email5_sent_at, now()),
    email6_sent_at = COALESCE(email6_sent_at, now()),
    email7_sent_at = COALESCE(email7_sent_at, now()),
    welcome_sent_at = COALESCE(welcome_sent_at, now()),
    verification_reminder_1_sent_at = COALESCE(verification_reminder_1_sent_at, now()),
    verification_reminder_2_sent_at = COALESCE(verification_reminder_2_sent_at, now())
WHERE LOWER(email) IN ('camesha.russell03@gmail.com', 'jinean.whitleycheng@gmail.com');
