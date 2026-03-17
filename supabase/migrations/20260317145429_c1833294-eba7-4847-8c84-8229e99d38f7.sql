CREATE TABLE public.lead_captures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  organization_name text,
  role text,
  source text DEFAULT 'organizations_page',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.lead_captures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit lead form" ON public.lead_captures FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Admins can view leads" ON public.lead_captures FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));