-- Drop old restrictive policy and replace with one allowing anon+authenticated SELECT
DROP POLICY IF EXISTS "Authenticated users can view resources" ON public.resources;

CREATE POLICY "Anyone can view resources"
ON public.resources
FOR SELECT
TO anon, authenticated
USING (true);