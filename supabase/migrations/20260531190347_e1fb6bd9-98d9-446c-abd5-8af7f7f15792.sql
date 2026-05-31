CREATE TABLE public.waitlist_recovery_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL,
  attempted_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_waitlist_recovery_attempts_ip_time
  ON public.waitlist_recovery_attempts (ip_address, attempted_at DESC);

-- Service-role only; edge function uses service key.
GRANT ALL ON public.waitlist_recovery_attempts TO service_role;

ALTER TABLE public.waitlist_recovery_attempts ENABLE ROW LEVEL SECURITY;

-- No policies = no anon/authenticated access. Service role bypasses RLS.