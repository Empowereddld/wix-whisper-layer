import { useQuery } from "@tanstack/react-query";
import {
  ShopifyProduct,
  STOREFRONT_PRODUCTS_QUERY,
  storefrontApiRequest,
} from "@/lib/shopify";
import { useRegionStore } from "@/stores/regionStore";

export const useShopifyProducts = () => {
  const countryCode = useRegionStore((s) => s.countryCode);
  return useQuery<ShopifyProduct[], Error>({
    queryKey: ["shopify-products", countryCode],
    queryFn: async () => {
      const data = await storefrontApiRequest(STOREFRONT_PRODUCTS_QUERY, {
        first: 50,
        country: countryCode,
      });
      return (data?.data?.products?.edges ?? []) as ShopifyProduct[];
    },
    staleTime: 1000 * 60 * 5,
  });
};
