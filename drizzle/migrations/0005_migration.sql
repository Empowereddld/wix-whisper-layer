-- Batch 3B: these actions take a referral code as identity, so only the
-- server (which first checks the signed dashboard pass) may call them.
REVOKE EXECUTE ON FUNCTION public.claim_waitlist_reward(text, text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.submit_waitlist_suggestion(text, text, text, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.vote_waitlist_suggestion(text, uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_user_voted_suggestions(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.claim_social_follow(text, text, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_waitlist_reward(text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.submit_waitlist_suggestion(text, text, text, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.vote_waitlist_suggestion(text, uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_user_voted_suggestions(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.claim_social_follow(text, text, integer) TO service_role;