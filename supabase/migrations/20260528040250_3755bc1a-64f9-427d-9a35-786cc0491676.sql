CREATE OR REPLACE FUNCTION public.get_storybuilders_waitlist_count()
 RETURNS integer
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT COUNT(*)::integer FROM public.storybuilders_waitlist WHERE deleted_at IS NULL;
$function$;

CREATE OR REPLACE FUNCTION public.get_waitlist_by_referral(p_code text)
 RETURNS TABLE(id uuid, name text, email text, referral_code text, invite_count integer, created_at timestamp with time zone)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT w.id, w.name, w.email, w.referral_code, w.invite_count, w.created_at
  FROM public.storybuilders_waitlist w
  WHERE w.referral_code = p_code AND w.deleted_at IS NULL;
$function$;