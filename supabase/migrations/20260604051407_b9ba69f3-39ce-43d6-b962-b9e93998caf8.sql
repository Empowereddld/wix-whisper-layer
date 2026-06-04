
-- 1) Suggestion Board: public read restricted to approved only
DROP POLICY IF EXISTS "Anyone can view suggestions" ON public.waitlist_suggestions;
CREATE POLICY "Public can view approved suggestions"
  ON public.waitlist_suggestions
  FOR SELECT
  USING (status = 'approved');

-- Admins manage policy already exists and covers full read/write for admins.

-- 2) Pin search_path on pgmq helper functions (linter: function_search_path_mutable)
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public, pgmq;
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public, pgmq;
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public, pgmq;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public, pgmq;
