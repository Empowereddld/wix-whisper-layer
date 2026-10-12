CREATE TABLE public.merch_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shopify_order_id text NOT NULL UNIQUE,
  order_name text,
  customer_name text,
  customer_email text,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total_price numeric,
  currency text,
  financial_status text,
  ordered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.merch_orders TO authenticated;
GRANT ALL ON public.merch_orders TO service_role;
ALTER TABLE public.merch_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view merch orders" ON public.merch_orders
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));