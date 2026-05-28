
-- Restore column-level grants we revoked, then drop the column entirely
GRANT SELECT (private_file_path) ON public.resources TO anon;
GRANT SELECT (private_file_path) ON public.resources TO authenticated;

-- Dedicated, admin/service-only table for private storage paths
CREATE TABLE public.resource_private_files (
  resource_id uuid PRIMARY KEY,
  storage_path text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Grants: no anon/authenticated SELECT. Admins read via service role in the edge function.
GRANT ALL ON public.resource_private_files TO service_role;

ALTER TABLE public.resource_private_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage resource private files"
  ON public.resource_private_files
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Backfill from the column we're about to drop
INSERT INTO public.resource_private_files (resource_id, storage_path)
SELECT id, private_file_path
FROM public.resources
WHERE private_file_path IS NOT NULL
ON CONFLICT (resource_id) DO UPDATE SET storage_path = EXCLUDED.storage_path;

-- Drop the column from resources so SELECT * is safe
ALTER TABLE public.resources DROP COLUMN private_file_path;
