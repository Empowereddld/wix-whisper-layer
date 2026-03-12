
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS excerpt text;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS categories text[] DEFAULT '{}';

CREATE POLICY "Anyone can view published blog posts"
ON public.blog_posts
FOR SELECT
TO anon, authenticated
USING (status = 'published');
