import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  resource_id: string;
  price: number;
  stripe_price_id: string | null;
  currency: string;
  is_active: boolean;
  tax_rate: number | null;
  created_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  resource_id: string;
  product_id: string;
  stripe_payment_intent_id: string | null;
  amount_paid: number;
  currency: string;
  status: string;
  purchased_at: string;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .then(({ data }) => {
        if (data) setProducts(data as Product[]);
        setLoading(false);
      });
  }, []);

  const priceMap = useMemo(() => {
    const map: Record<string, Product> = {};
    products.forEach((p) => {
      map[p.resource_id] = p;
    });
    return map;
  }, [products]);

  return { products, priceMap, loading };
}

export function usePurchases(userId?: string) {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPurchases = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    const { data } = await supabase
      .from("purchases")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "completed");
    if (data) setPurchases(data as Purchase[]);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchPurchases(); }, [fetchPurchases]);

  const purchasedResourceIds = useMemo(
    () => new Set(purchases.map((p) => p.resource_id)),
    [purchases]
  );

  return { purchases, purchasedResourceIds, loading, refetch: fetchPurchases };
}
