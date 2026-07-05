
DROP POLICY IF EXISTS "Anyone can view resources" ON public.resources;

CREATE POLICY "Public can view published non-private resources"
ON public.resources FOR SELECT
TO anon
USING (is_published = true AND COALESCE(is_private, false) = false);

CREATE POLICY "Authenticated can view published resources"
ON public.resources FOR SELECT
TO authenticated
USING (is_published = true OR has_role(auth.uid(), 'admin'::app_role));
