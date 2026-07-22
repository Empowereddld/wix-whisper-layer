import { toast } from "sonner";

export const SHOPIFY_API_VERSION = "2025-07";
export const SHOPIFY_STORE_PERMANENT_DOMAIN = "wix-whisper-layer-8yzs2.myshopify.com";
export const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
export const SHOPIFY_STOREFRONT_TOKEN = "9a650bbe2ebffac0c2d96cacb8963043";

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          availableForSale: boolean;
          selectedOptions: Array<{
            name: string;
            value: string;
          }>;
        };
      }>;
    };
    options: Array<{
      name: string;
      values: string[];
    }>;
  };
}

export const STOREFRONT_PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String, $country: CountryCode!)
  @inContext(country: $country) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          description
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 20) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            name
            values
          }
        }
      }
    }
  }
`;

export const STOREFRONT_PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!, $country: CountryCode!)
  @inContext(country: $country) {
    productByHandle(handle: $handle) {
      id
      title
      description
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 20) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
      options {
        name
        values
      }
    }
  }
`;


export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    toast.error("Shopify: Payment required", {
      description:
        "Shopify API access requires an active Shopify billing plan. Upgrade your store to continue.",
    });
    return null;
  }

  if (!response.ok) {
    throw new Error(`Shopify HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(`Error calling Shopify: ${data.errors.map((e: { message: string }) => e.message).join(", ")}`);
  }

  return data;
}

// EU/EEA country ISO codes that should map to our EUR market entry.
const EU_ISO_CODES = new Set([
  "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT",
  "LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE",
  // EEA-adjacent that commonly want EUR display
  "IS","LI","NO",
]);

type SupportedCountry = "CA" | "US" | "GB" | "IE" | "AU" | "NZ";

const LOCALIZATION_QUERY = `
  query { localization { country { isoCode } } }
`;

/**
 * Ask Shopify (via Storefront API) which country the visitor is in based on
 * their IP. Maps the ISO code to one of our supported market entries.
 * Falls back to "US" if detection fails or the country isn't supported.
 */
export async function detectBuyerCountry(): Promise<SupportedCountry> {
  try {
    const data = await storefrontApiRequest(LOCALIZATION_QUERY);
    const iso: string | undefined = data?.data?.localization?.country?.isoCode;
    if (!iso) return "US";
    if (iso === "CA" || iso === "US" || iso === "GB" || iso === "AU" || iso === "NZ") return iso;
    if (EU_ISO_CODES.has(iso)) return "IE";
    return "US";
  } catch {
    return "US";
  }
}


export function formatShopifyPrice(amount: string, currencyCode: string) {
  const value = parseFloat(amount);
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: currencyCode,
  }).format(value);
}

// Per-handle image controls. Filter out unwanted mockups by URL substring, and
// optionally pin a specific image (by URL substring) to appear first in the
// gallery + as the card thumbnail on the merch grid.
const IMAGE_EXCLUDES: Record<string, string[]> = {
  "1-in-14-dld-awareness-tote-bag": [
    // Flat Gelato mockup — we prefer the lifestyle photos instead.
    "02cb1f38-7b60-4c41-b1ac-38a3f02a4e99",
  ],
  "my-ideas-are-worth-waiting-for-kids-water-bottle": [
    // Plain flat Gelato mockup (no lifestyle context).
    "833e3151-1a61-4bd5-b703-5d043bddd72b",
  ],
  "pause-please-i-m-thinking-kids-t-shirt": [
    // Grey/heather tee with pink shorts (duplicate of white-tee lifestyle shot).
    "14b5c0a6-3a9e-47bb-aee9-0116c36e8161",
    // Boy + girl walking with backpacks lifestyle mockup.
    "c02838c6-0583-4574-9981-bd85b592a491",
    // Flat Gildan tee mockup on black background.
    "f80a38ab-57b6-4c76-a581-111d9bd8c48a",
  ],
};

const PRIMARY_IMAGE_OVERRIDES: Record<string, string> = {
  // Biracial mom + son lifestyle photo.
  "1-in-14-dld-awareness-tote-bag": "f5d9b32c-faec-47ec-beb2-2c3f250cba9d",
  // Four kids outside holding bottles.
  "my-ideas-are-worth-waiting-for-kids-water-bottle": "704d3178-0a25-411d-b239-9c33c4fd1562",
};

export function getProductImages(product: ShopifyProduct["node"]) {
  const excludes = IMAGE_EXCLUDES[product.handle] ?? [];
  const filtered = product.images.edges
    .map((e) => e.node)
    .filter((n) => !!n?.url && !excludes.some((sub) => n.url.includes(sub)));

  const primary = PRIMARY_IMAGE_OVERRIDES[product.handle];
  if (primary) {
    const idx = filtered.findIndex((n) => n.url.includes(primary));
    if (idx > 0) {
      const [pinned] = filtered.splice(idx, 1);
      filtered.unshift(pinned);
    }
  }
  return filtered;
}

export function getFirstImage(product: ShopifyProduct["node"]) {
  return getProductImages(product)[0]?.url ?? "";
}
