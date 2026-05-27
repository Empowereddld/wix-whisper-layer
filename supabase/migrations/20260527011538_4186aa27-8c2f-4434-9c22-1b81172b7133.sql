CREATE TABLE public.waitlist_verification_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  waitlist_id uuid NOT NULL REFERENCES public.storybuilders_waitlist(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  used_at timestamptz
);

CREATE INDEX idx_wvt_token ON public.waitlist_verification_tokens(token);
CREATE INDEX idx_wvt_waitlist_id ON public.waitlist_verification_tokens(waitlist_id);

GRANT ALL ON public.waitlist_verification_tokens TO service_role;

ALTER TABLE public.waitlist_verification_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view verification tokens"
ON public.waitlist_verification_tokens
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Backfill from existing column for unverified users
INSERT INTO public.waitlist_verification_tokens (waitlist_id, token, created_at)
SELECT id, verification_token, COALESCE(verification_sent_at, created_at)
FROM public.storybuilders_waitlist
WHERE verification_token IS NOT NULL
  AND email_verified = false
ON CONFLICT (token) DO NOTHING;