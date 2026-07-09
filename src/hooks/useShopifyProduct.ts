import { useQuery } from "@tanstack/react-query";
import {
  ShopifyProduct,
  STOREFRONT_PRODUCT_BY_HANDLE_QUERY,
  storefrontApiRequest,
} from "@/lib/shopify";

export const useShopifyProduct = (handle: string | undefined) => {
  return useQuery<ShopifyProduct["node"] | null, Error>({
    queryKey: ["shopify-product", handle],
    queryFn: async () => {
      if (!handle) return null;
      const data = await storefrontApiRequest(STOREFRONT_PRODUCT_BY_HANDLE_QUERY, { handle });
      return (data?.data?.productByHandle ?? null) as ShopifyProduct["node"] | null;
    },
    enabled: Boolean(handle),
    staleTime: 1000 * 60 * 5,
  });
};
