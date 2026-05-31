
-- Tier 1 waitlist email monitoring: state + runs paper trail

CREATE TABLE public.waitlist_healthcheck_state (
  id integer PRIMARY KEY DEFAULT 1,
  check1_last_alert_at timestamptz,
  check2_last_alert_at timestamptz,
  check3_last_alert_at timestamptz,
  check4_last_alert_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT waitlist_healthcheck_state_singleton CHECK (id = 1)
);

GRANT SELECT, INSERT, UPDATE ON public.waitlist_healthcheck_state TO authenticated;
GRANT ALL ON public.waitlist_healthcheck_state TO service_role;

ALTER TABLE public.waitlist_healthcheck_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view healthcheck state"
ON public.waitlist_healthcheck_state FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.waitlist_healthcheck_state (id) VALUES (1);

CREATE TABLE public.waitlist_healthcheck_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ran_at timestamptz NOT NULL DEFAULT now(),
  checks_tripped jsonb NOT NULL DEFAULT '{}'::jsonb,
  alert_sent boolean NOT NULL DEFAULT false,
  alert_send_error text
);

GRANT SELECT ON public.waitlist_healthcheck_runs TO authenticated;
GRANT ALL ON public.waitlist_healthcheck_runs TO service_role;

ALTER TABLE public.waitlist_healthcheck_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view healthcheck runs"
ON public.waitlist_healthcheck_runs FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_waitlist_healthcheck_runs_ran_at ON public.waitlist_healthcheck_runs (ran_at DESC);
