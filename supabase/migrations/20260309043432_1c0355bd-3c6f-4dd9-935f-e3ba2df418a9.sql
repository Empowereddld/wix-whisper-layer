-- Add last_name column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_name text;

-- Update the handle_new_user function to include last_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, role, country, age_range)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', SPLIT_PART(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'last_name',
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'parent'),
    NEW.raw_user_meta_data->>'country',
    COALESCE((NEW.raw_user_meta_data->>'age_range')::age_range, 'not_applicable')
  );
  RETURN NEW;
END;
$function$;