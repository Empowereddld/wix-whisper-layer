
-- Enums
CREATE TYPE public.user_role AS ENUM ('parent', 'slp', 'educator', 'school_leader', 'other');
CREATE TYPE public.age_range AS ENUM ('0-4', '5-7', '8-10', '11-13', '14+', 'not_applicable');
CREATE TYPE public.resource_type AS ENUM ('poster','guide','checklist','handout','activity','bundle','infographic');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'parent',
  country TEXT,
  age_range age_range DEFAULT 'not_applicable',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Resources table
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  thumbnail_url TEXT,
  resource_type resource_type NOT NULL,
  settings TEXT[] DEFAULT '{}',
  age_ranges TEXT[] DEFAULT '{}',
  roles TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{English}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  download_count INTEGER DEFAULT 0
);

-- User Downloads table
CREATE TABLE public.user_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE NOT NULL,
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_downloads ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Resources policies
CREATE POLICY "Authenticated users can view resources" ON public.resources FOR SELECT TO authenticated USING (true);

-- User downloads policies
CREATE POLICY "Users can view own downloads" ON public.user_downloads FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own downloads" ON public.user_downloads FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, role, country, age_range)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'parent'),
    NEW.raw_user_meta_data->>'country',
    COALESCE((NEW.raw_user_meta_data->>'age_range')::age_range, 'not_applicable')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
