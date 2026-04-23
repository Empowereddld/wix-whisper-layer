
-- Enable scheduling extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Track Email 2 (24-hour follow-up) sends
ALTER TABLE public.storybuilders_waitlist
  ADD COLUMN IF NOT EXISTS email2_sent_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_waitlist_email2_pending
  ON public.storybuilders_waitlist (created_at)
  WHERE email2_sent_at IS NULL;

-- Schedule the Email 2 dispatcher to run every 15 minutes
SELECT cron.schedule(
  'send-waitlist-email2-followup',
  '*/15 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://haafpznzuazanylcelse.supabase.co/functions/v1/send-waitlist-email2',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhYWZwem56dWF6YW55bGNlbHNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNDk2MTYsImV4cCI6MjA4NzgyNTYxNn0.Fx2Fxcu1zGUXUVQ6lngLrhlA_uVyvLr1PmPjjsS4Cw0'
    ),
    body := jsonb_build_object('triggered_at', now())
  ) AS request_id;
  $$
);
