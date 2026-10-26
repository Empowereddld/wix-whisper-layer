ALTER TABLE public.purchases
  ADD COLUMN IF NOT EXISTS access_token_version integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS access_status text NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS access_changed_at timestamptz,
  ADD COLUMN IF NOT EXISTS access_change_reason text,
  ADD COLUMN IF NOT EXISTS refunded_at timestamptz,
  ADD COLUMN IF NOT EXISTS amount_refunded integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS confirmation_email_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS confirmation_email_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS confirmation_email_attempts integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS confirmation_email_claimed_at timestamptz,
  ADD COLUMN IF NOT EXISTS confirmation_email_last_error text;