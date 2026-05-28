
-- Fix 9: Remove storybuilders_waitlist from realtime publication
ALTER PUBLICATION supabase_realtime DROP TABLE public.storybuilders_waitlist;

-- Fix 10: Drop anon INSERT policy on suppressed_emails
DROP POLICY IF EXISTS "Anyone can unsubscribe" ON public.suppressed_emails;

-- Fix 11: Add private_file_path + is_private to resources
ALTER TABLE public.resources
  ADD COLUMN IF NOT EXISTS private_file_path text,
  ADD COLUMN IF NOT EXISTS is_private boolean NOT NULL DEFAULT false;

-- Backfill: move resources-private/* paths out of file_url
UPDATE public.resources
SET private_file_path = file_url,
    is_private = true,
    file_url = NULL
WHERE file_url LIKE 'resources-private/%';

-- Hide private_file_path from anon and authenticated; service_role keeps access
REVOKE SELECT (private_file_path) ON public.resources FROM anon;
REVOKE SELECT (private_file_path) ON public.resources FROM authenticated;
GRANT SELECT (private_file_path) ON public.resources TO service_role;
