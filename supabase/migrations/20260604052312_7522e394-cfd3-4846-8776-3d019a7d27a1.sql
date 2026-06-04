CREATE TABLE IF NOT EXISTS public.cron_auth_failures (
  id BIGSERIAL PRIMARY KEY,
  function_name TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS cron_auth_failures_created_at_idx ON public.cron_auth_failures (created_at DESC);
CREATE INDEX IF NOT EXISTS cron_auth_failures_function_idx ON public.cron_auth_failures (function_name, created_at DESC);
GRANT SELECT ON public.cron_auth_failures TO authenticated;
GRANT ALL ON public.cron_auth_failures TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.cron_auth_failures_id_seq TO service_role;
ALTER TABLE public.cron_auth_failures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view cron auth failures" ON public.cron_auth_failures FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE IF NOT EXISTS public.cron_abuse_alerts (
  id BIGSERIAL PRIMARY KEY,
  alert_window_start TIMESTAMPTZ NOT NULL,
  alert_window_end TIMESTAMPTZ NOT NULL,
  failure_count INTEGER NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (alert_window_start)
);
GRANT SELECT ON public.cron_abuse_alerts TO authenticated;
GRANT ALL ON public.cron_abuse_alerts TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.cron_abuse_alerts_id_seq TO service_role;
ALTER TABLE public.cron_abuse_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view cron abuse alerts" ON public.cron_abuse_alerts FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));