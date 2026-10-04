CREATE TABLE public.streaming_link_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.streaming_link_clicks TO anon;
GRANT INSERT ON public.streaming_link_clicks TO authenticated;
GRANT ALL ON public.streaming_link_clicks TO service_role;

ALTER TABLE public.streaming_link_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can record a streaming link click"
  ON public.streaming_link_clicks
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);