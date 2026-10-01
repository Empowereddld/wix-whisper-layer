CREATE TABLE public.emailoctopus_synced_users (
  user_id uuid PRIMARY KEY,
  synced_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.emailoctopus_synced_users TO service_role;
ALTER TABLE public.emailoctopus_synced_users ENABLE ROW LEVEL SECURITY;