CREATE TABLE public.email_rate_limits (
  id bigserial PRIMARY KEY,
  bucket text NOT NULL,
  key_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.email_rate_limits TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.email_rate_limits_id_seq TO service_role;
ALTER TABLE public.email_rate_limits ENABLE ROW LEVEL SECURITY;
CREATE INDEX email_rate_limits_lookup ON public.email_rate_limits (bucket, key_hash, created_at);
CREATE INDEX email_rate_limits_created ON public.email_rate_limits (created_at);
COMMENT ON TABLE public.waitlist_recovery_attempts IS 'DEPRECATED: replaced by email_rate_limits (hashed identifiers). Kept until abuse log review.';

SELECT cron.schedule('purge-email-rate-limits', '17 * * * *',
  $$DELETE FROM public.email_rate_limits WHERE created_at < now() - interval '2 days'$$);