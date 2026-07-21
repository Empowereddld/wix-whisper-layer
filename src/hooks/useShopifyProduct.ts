import { useQuery } from "@tanstack/react-query";
import {
  ShopifyProduct,
  STOREFRONT_PRODUCT_BY_HANDLE_QUERY,
  storefrontApiRequest,
} from "@/lib/shopify";
import { useRegionStore } from "@/stores/regionStore";

export const useShopifyProduct = (handle: string | undefined) => {
  const countryCode = useRegionStore((s) => s.countryCode);
  return useQuery<ShopifyProduct["node"] | null, Error>({
    queryKey: ["shopify-product", handle, countryCode],
    queryFn: async () => {
      if (!handle) return null;
      const data = await storefrontApiRequest(STOREFRONT_PRODUCT_BY_HANDLE_QUERY, {
        handle,
        country: countryCode,
      });
      return (data?.data?.productByHandle ?? null) as ShopifyProduct["node"] | null;
    },
    enabled: Boolean(handle),
    staleTime: 1000 * 60 * 5,
  });
};
