
-- saved_resources table for bookmarks
CREATE TABLE public.saved_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id uuid NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  saved_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, resource_id)
);
ALTER TABLE public.saved_resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own saves" ON public.saved_resources FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own saves" ON public.saved_resources FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own saves" ON public.saved_resources FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- share_events table
CREATE TABLE public.share_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id uuid NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  shared_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.share_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert own shares" ON public.share_events FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all shares" ON public.share_events FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));

-- resource_requests table
CREATE TABLE public.resource_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic text NOT NULL,
  audience text NOT NULL,
  context text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.resource_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert own requests" ON public.resource_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own requests" ON public.resource_requests FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage requests" ON public.resource_requests FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
