
CREATE TABLE public.user_resource_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  resource_id uuid NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  viewed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, resource_id)
);

ALTER TABLE public.user_resource_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own views" ON public.user_resource_views
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own views" ON public.user_resource_views
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
