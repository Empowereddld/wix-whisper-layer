
-- Storage RLS for resources-private bucket (admin-only direct access; reads go through signed URLs via service role)
CREATE POLICY "Admins can read resources-private"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'resources-private' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can upload to resources-private"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'resources-private' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update resources-private"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'resources-private' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'resources-private' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete resources-private"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'resources-private' AND public.has_role(auth.uid(), 'admin'));

-- Hide waitlist_id from public reads on waitlist_suggestions (column-level grant alongside existing RLS)
REVOKE SELECT (waitlist_id) ON public.waitlist_suggestions FROM anon, authenticated;
