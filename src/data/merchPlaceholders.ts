import tshirt from "@/assets/merch-tshirt.jpg";
import mug from "@/assets/merch-mug.jpg";
import tote from "@/assets/merch-tote.jpg";

export interface MerchVariant {
  id: string;
  label: string;
  inStock: boolean;
}

export interface MerchProduct {
  handle: string;
  title: string;
  tagline: string;
  description: string;
  price: number; // USD cents
  image: string;
  images: string[];
  variantLabel: string; // e.g. "Size", "Color"
  variants: MerchVariant[];
  badge?: string;
}

export const merchPlaceholders: MerchProduct[] = [
  {
    handle: "empowered-dld-tee",
    title: "Empowered DLD Tee",
    tagline: "Soft cotton, bold purpose",
    description:
      "A unisex tee in our signature purple, made for everyday wear. Every shirt helps more people learn what DLD is. Printed on demand and shipped worldwide by our print partner.",
    price: 2800,
    image: tshirt,
    images: [tshirt],
    variantLabel: "Size",
    variants: [
      { id: "xs", label: "XS", inStock: true },
      { id: "s", label: "S", inStock: true },
      { id: "m", label: "M", inStock: true },
      { id: "l", label: "L", inStock: true },
      { id: "xl", label: "XL", inStock: true },
      { id: "2xl", label: "2XL", inStock: true },
    ],
    badge: "New",
  },
  {
    handle: "living-life-with-dld-mug",
    title: "Living Life with DLD Mug",
    tagline: "11oz ceramic, for slow mornings",
    description:
      "Wrap your hands around a reminder that you are not alone. A bright purple band carries the Living Life with DLD wordmark. Dishwasher and microwave safe.",
    price: 1800,
    image: mug,
    images: [mug],
    variantLabel: "Size",
    variants: [
      { id: "11oz", label: "11oz", inStock: true },
      { id: "15oz", label: "15oz", inStock: true },
    ],
  },
  {
    handle: "empowered-dld-tote",
    title: "Empowered DLD Tote",
    tagline: "Carry the conversation",
    description:
      "Natural canvas tote with a deep purple Empowered DLD print. Roomy enough for books, library hauls, and weekend errands. A quiet way to start conversations.",
    price: 2200,
    image: tote,
    images: [tote],
    variantLabel: "Style",
    variants: [
      { id: "natural", label: "Natural", inStock: true },
    ],
  },
];

export const findMerchProduct = (handle: string) =>
  merchPlaceholders.find((p) => p.handle === handle);

export const formatMerchPrice = (cents: number) =>
  `$${(cents / 100).toFixed(2)}`;
