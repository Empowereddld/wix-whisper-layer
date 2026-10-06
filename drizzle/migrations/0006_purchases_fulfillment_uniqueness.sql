ALTER TABLE public.purchases ADD COLUMN IF NOT EXISTS stripe_checkout_session_id text;
CREATE UNIQUE INDEX IF NOT EXISTS purchases_unique_payment_intent ON public.purchases (stripe_payment_intent_id) WHERE stripe_payment_intent_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS purchases_unique_checkout_session ON public.purchases (stripe_checkout_session_id) WHERE stripe_checkout_session_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS purchases_unique_completed_user_resource ON public.purchases (user_id, resource_id) WHERE status = 'completed';