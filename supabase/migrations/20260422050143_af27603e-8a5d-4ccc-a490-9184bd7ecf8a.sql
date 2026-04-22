-- Add email verification columns to storybuilders_waitlist
ALTER TABLE public.storybuilders_waitlist
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS verification_token TEXT,
  ADD COLUMN IF NOT EXISTS verification_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_storybuilders_waitlist_verification_token
  ON public.storybuilders_waitlist(verification_token)
  WHERE verification_token IS NOT NULL;

-- RPC: verify a waitlist email by token (SECURITY DEFINER so anon can call it safely)
CREATE OR REPLACE FUNCTION public.verify_waitlist_email(p_token TEXT)
RETURNS TABLE(success BOOLEAN, email TEXT, already_verified BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_record RECORD;
BEGIN
  SELECT id, email, email_verified
  INTO v_record
  FROM public.storybuilders_waitlist
  WHERE verification_token = p_token
  LIMIT 1;

  IF v_record IS NULL THEN
    RETURN QUERY SELECT false, NULL::TEXT, false;
    RETURN;
  END IF;

  IF v_record.email_verified THEN
    RETURN QUERY SELECT true, v_record.email, true;
    RETURN;
  END IF;

  UPDATE public.storybuilders_waitlist
  SET email_verified = true,
      verified_at = now(),
      verification_token = NULL
  WHERE id = v_record.id;

  RETURN QUERY SELECT true, v_record.email, false;
END;
$$;

GRANT EXECUTE ON FUNCTION public.verify_waitlist_email(TEXT) TO anon, authenticated;