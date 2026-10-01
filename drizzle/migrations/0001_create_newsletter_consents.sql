CREATE TABLE public.newsletter_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  waitlist_id uuid REFERENCES public.storybuilders_waitlist(id) ON DELETE SET NULL,
  email text NOT NULL,
  consented boolean NOT NULL,
  source text NOT NULL,
  wording_version text NOT NULL,
  checkbox_text text NOT NULL,
  helper_text text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX newsletter_consents_email_idx ON public.newsletter_consents (lower(email));
CREATE INDEX newsletter_consents_waitlist_idx ON public.newsletter_consents (waitlist_id);

GRANT INSERT ON public.newsletter_consents TO authenticated;
GRANT ALL ON public.newsletter_consents TO service_role;

ALTER TABLE public.newsletter_consents ENABLE ROW LEVEL SECURITY;

-- Authenticated users may record their own consent choice only.
CREATE POLICY "Users record own consent"
ON public.newsletter_consents
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- No SELECT/UPDATE/DELETE policies: records are service-role only (append-only audit).
