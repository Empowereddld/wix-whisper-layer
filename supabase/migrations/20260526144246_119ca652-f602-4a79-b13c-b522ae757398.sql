ALTER TABLE public.email_send_log
  ADD COLUMN IF NOT EXISTS opened_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS clicked_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS email_send_log_message_id_idx ON public.email_send_log(message_id);
CREATE INDEX IF NOT EXISTS email_send_log_recipient_email_idx ON public.email_send_log(recipient_email);