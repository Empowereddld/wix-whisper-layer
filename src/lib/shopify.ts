import { toast } from "sonner";
import toteFlatlay from "@/assets/tote-flatlay-desk.png.asset.json";


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
  const formatted = new Intl.NumberFormat("en", {
    style: "currency",
    currency: currencyCode,
  }).format(value);

  // Explicitly label US dollars so visitors see "USD $22.00".
  if (currencyCode === "USD") {
    return `USD ${formatted}`;
  }

  return formatted;
}

// Per-handle image controls. Filter out unwanted mockups by URL substring, and
// optionally pin a specific image (by URL substring) to appear first in the
// gallery + as the card thumbnail on the merch grid.
const IMAGE_EXCLUDES: Record<string, string[]> = {
  "my-ideas-are-worth-waiting-for-kids-water-bottle": [
    // Plain flat Gelato mockup (no lifestyle context).
    "833e3151-1a61-4bd5-b703-5d043bddd72b",
    // Plain white-background studio shots (older render, missing the logo).
    "483741e2-fb7c-4050-8403-398cd7894bb8",
    "057946b2-fb2d-4b4f-9930-13b4190fc58d",
    "49ff3f20-d352-45a0-90c1-391433058cc0",
    // Plain white-background bottle render after the Gelato re-sync.
    "d43e474c-97ff-4707-a09a-4c158b2bb256",
  ],
  "pause-please-i-m-thinking-kids-t-shirt": [
    // Grey/heather tee with pink shorts (duplicate of white-tee lifestyle shot).
    "14b5c0a6-3a9e-47bb-aee9-0116c36e8161",
    "55c3df09-ccb1-42d3-bdf2-12e32d98382e",
    // Boy + girl walking with backpacks lifestyle mockup.
    "c02838c6-0583-4574-9981-bd85b592a491",
    // Flat Gildan tee mockup on black background.
    "f80a38ab-57b6-4c76-a581-111d9bd8c48a",
  ],
  "tote-bag-1-in-14-dld-awareness-tote-bag": [
    // Plain flat Gelato tote mockup (no lifestyle context).
    "2780088c-4f01-4ca9-9eb7-1617ee594932",
    "d3c890cc-bed0-470e-a709-cc0b14bd26f7",
  ],
};

const PRIMARY_IMAGE_OVERRIDES: Record<string, string> = {
  // Four kids outside school, girl holding the bottle.
  "my-ideas-are-worth-waiting-for-kids-water-bottle": "4d0449c9-71ad-4008-9d6f-e67c15c6166a",
  // Woman outside elementary school carrying the tote.
  "tote-bag-1-in-14-dld-awareness-tote-bag": "d4b73496-40da-407d-9a40-95a4dbbe3ff6",
};

// Extra site-hosted mockups appended to a product's Shopify gallery.
const EXTRA_IMAGES: Record<string, Array<{ url: string; altText: string | null }>> = {
  "tote-bag-1-in-14-dld-awareness-tote-bag": [
    {
      url: toteFlatlay.url,
      altText: "1 in 14 DLD awareness tote bag styled on a desk with a book and coffee",
    },
  ],
};

/**
 * Shopify sometimes stores the same photo twice (e.g. "abc.png" and
 * "abc_1234-5678.png"). Collapse those to one entry by keying on the leading
 * UUID of the filename.
 */
function imageDedupeKey(url: string) {
  const file = url.split("?")[0].split("/").pop() ?? url;
  const base = file.replace(/\.[a-z0-9]+$/i, "");
  return base.split("_")[0];
}

export function getProductImages(product: ShopifyProduct["node"]) {
  const excludes = IMAGE_EXCLUDES[product.handle] ?? [];
  const seen = new Set<string>();
  const filtered = product.images.edges
    .map((e) => e.node)
    .filter((n) => !!n?.url && !excludes.some((sub) => n.url.includes(sub)))
    .filter((n) => {
      const key = imageDedupeKey(n.url);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });


  filtered.push(...(EXTRA_IMAGES[product.handle] ?? []));


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

/**
 * Ask the Shopify CDN for a resized/WebP version of a product image so we
 * download only what we display instead of the full-resolution original.
 * Non-Shopify URLs (site-hosted assets) are returned untouched.
 */
export function shopifyImageUrl(url: string, width: number) {
  if (!url || !url.includes("cdn.shopify.com")) return url;
  const [base, query = ""] = url.split("?");
  const params = new URLSearchParams(query);
  params.set("width", String(width));
  return `${base}?${params.toString()}`;
}
