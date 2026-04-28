-- Double opt-in support: track Welcome dispatch and verification reminders
ALTER TABLE public.storybuilders_waitlist
  ADD COLUMN IF NOT EXISTS welcome_sent_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS verification_reminder_1_sent_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS verification_reminder_2_sent_at timestamp with time zone;

-- Schedule the verification reminder dispatcher to run hourly
DO $$
DECLARE
  v_existing bigint;
BEGIN
  SELECT jobid INTO v_existing FROM cron.job WHERE jobname = 'send-verification-reminders';
  IF v_existing IS NOT NULL THEN
    PERFORM cron.unschedule(v_existing);
  END IF;
END$$;

SELECT cron.schedule(
  'send-verification-reminders',
  '0 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://haafpznzuazanylcelse.supabase.co/functions/v1/send-verification-reminders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('supabase_functions.service_role_key', true)
    ),
    body := '{}'::jsonb
  );
  $$
);