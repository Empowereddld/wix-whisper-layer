
-- Create a private storage bucket for paid resources
INSERT INTO storage.buckets (id, name, public) VALUES ('resources-private', 'resources-private', false);

-- Allow authenticated users to read from private bucket (but actual access controlled by edge function using service role)
-- No public SELECT policy = files are private by default
