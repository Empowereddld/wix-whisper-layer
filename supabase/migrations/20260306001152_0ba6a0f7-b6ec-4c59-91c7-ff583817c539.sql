
-- Drop the overly permissive update policy
DROP POLICY "Authenticated users can update download count" ON public.resources;

-- Create a secure function to increment download count
CREATE OR REPLACE FUNCTION public.increment_download_count(resource_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.resources
  SET download_count = COALESCE(download_count, 0) + 1
  WHERE id = resource_id;
END;
$$;
