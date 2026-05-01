-- Backfill ALL tier email timestamps for both admin accounts (across duplicate
-- waitlist rows) so the dispatcher cron never sends catch-up tier emails to
-- camesha.russell03@gmail.com or jinean.whitleycheng@gmail.com. Future emails
-- will only fire on real point-threshold transitions from this point forward.
UPDATE public.storybuilders_waitlist
SET welcome_sent_at = COALESCE(welcome_sent_at, now()),
    email2_sent_at  = COALESCE(email2_sent_at,  now()),
    email3_sent_at  = COALESCE(email3_sent_at,  now()),
    email4_sent_at  = COALESCE(email4_sent_at,  now()),
    email5_sent_at  = COALESCE(email5_sent_at,  now()),
    email6_sent_at  = COALESCE(email6_sent_at,  now()),
    email7_sent_at  = COALESCE(email7_sent_at,  now()),
    verification_reminder_1_sent_at = COALESCE(verification_reminder_1_sent_at, now()),
    verification_reminder_2_sent_at = COALESCE(verification_reminder_2_sent_at, now())
WHERE email IN ('camesha.russell03@gmail.com', 'jinean.whitleycheng@gmail.com');