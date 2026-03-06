
-- Allow authenticated users to update download_count on resources
CREATE POLICY "Authenticated users can update download count"
ON public.resources
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
