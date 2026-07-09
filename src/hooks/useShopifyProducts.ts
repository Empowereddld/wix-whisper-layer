import { useQuery } from "@tanstack/react-query";
import {
  ShopifyProduct,
  STOREFRONT_PRODUCTS_QUERY,
  storefrontApiRequest,
} from "@/lib/shopify";

export const useShopifyProducts = () => {
  return useQuery<ShopifyProduct[], Error>({
    queryKey: ["shopify-products"],
    queryFn: async () => {
      const data = await storefrontApiRequest(STOREFRONT_PRODUCTS_QUERY, { first: 50 });
      return (data?.data?.products?.edges ?? []) as ShopifyProduct[];
    },
    staleTime: 1000 * 60 * 5,
  });
};
