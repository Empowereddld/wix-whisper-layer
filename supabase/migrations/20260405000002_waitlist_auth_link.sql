-- Add user_id column to link waitlist entries to authenticated accounts
ALTER TABLE storybuilders_waitlist
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_user_id ON storybuilders_waitlist(user_id);

-- RPC function to link a waitlist entry to an auth account by email
CREATE OR REPLACE FUNCTION link_waitlist_to_auth(p_user_id UUID, p_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE storybuilders_waitlist
  SET user_id = p_user_id
  WHERE email = p_email AND user_id IS NULL;
  RETURN FOUND;
END;
$$;
