
CREATE TABLE public.founder_claims (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  waitlist_id uuid NOT NULL UNIQUE,
  founder_slot_number integer,
  recipient_name text NOT NULL,
  shipping_street text NOT NULL,
  shipping_street2 text,
  shipping_city text NOT NULL,
  shipping_region text NOT NULL,
  shipping_postal_code text NOT NULL,
  shipping_country text NOT NULL,
  shipping_phone text,
  inscription_to text NOT NULL,
  inscription_note text,
  merch_size text,
  additional_notes text,
  status text NOT NULL DEFAULT 'submitted',
  fulfilled_at timestamptz,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.founder_claims ENABLE ROW LEVEL SECURITY;

-- Edge function uses service role; admins manage via UI.
CREATE POLICY "Admins can manage founder claims"
ON public.founder_claims
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.touch_founder_claims_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER founder_claims_updated_at
BEFORE UPDATE ON public.founder_claims
FOR EACH ROW
EXECUTE FUNCTION public.touch_founder_claims_updated_at();

CREATE INDEX idx_founder_claims_status ON public.founder_claims (status);
CREATE INDEX idx_founder_claims_slot ON public.founder_claims (founder_slot_number);
