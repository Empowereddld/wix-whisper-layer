import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Truck, Package, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useMerchCartStore } from "@/stores/merchCartStore";
import {
  formatShopifyPrice,
  getProductImages,
  type ShopifyProduct,
} from "@/lib/shopify";
import { toast } from "sonner";
import {
  getMerchDisplayTitle,
  MerchProductTitle,
} from "./MerchProductTitle";

interface Props {
  product: ShopifyProduct["node"];
}

/**
 * Split a raw Shopify product description into intro copy plus optional
 * Size Guide / Care Instructions sections. Falls back to putting everything
 * in `intro` when no matching headings are found.
 */
function splitProductDescription(raw: string): {
  intro: string;
  sizeGuide: string;
  careInstructions: string;
} {
  const text = (raw || "").replace(/\r\n/g, "\n").trim();
  if (!text) return { intro: "", sizeGuide: "", careInstructions: "" };

  // Match a heading line for size or care sections. Headings are usually on
  // their own line, may end with a colon, and are case-insensitive.
  const headingRegex =
    /^[ \t]*(size chart|size guide|sizing|size & fit|care instructions|care guide|care)\s*:?\s*$/gim;

  type Match = { index: number; length: number; kind: "size" | "care" };
  const matches: Match[] = [];
  let m: RegExpExecArray | null;
  while ((m = headingRegex.exec(text)) !== null) {
    const label = m[1].toLowerCase();
    const kind: "size" | "care" = label.startsWith("size") || label.startsWith("sizing")
      ? "size"
      : "care";
    matches.push({ index: m.index, length: m[0].length, kind });
  }

  if (matches.length === 0) {
    return { intro: text, sizeGuide: "", careInstructions: "" };
  }

  const intro = text.slice(0, matches[0].index).trim();
  let sizeGuide = "";
  let careInstructions = "";

  matches.forEach((match, i) => {
    const start = match.index + match.length;
    const end = i + 1 < matches.length ? matches[i + 1].index : text.length;
    const body = text.slice(start, end).trim();
    if (match.kind === "size") sizeGuide = body;
    else careInstructions = body;
  });

  return { intro, sizeGuide, careInstructions };
}

/**
 * Render a plain-text block as paragraphs + bullet lists.
 * - Blank lines separate blocks.
 * - Lines starting with "-", "*", "•" (optionally after whitespace) become bullets.
 */
function FormattedText({ text }: { text: string }) {
  const trimmed = (text || "").replace(/\r\n/g, "\n").trim();
  if (!trimmed) return null;
  const blocks = trimmed.split(/\n\s*\n/);
  const bulletRe = /^\s*[-*•]\s+/;

  return (
    <div className="space-y-4 text-[14px] md:text-[15px] text-muted-foreground leading-[1.75]">
      {blocks.map((block, i) => {
        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
        const allBullets = lines.length > 0 && lines.every((l) => bulletRe.test(l));
        if (allBullets) {
          return (
            <ul key={i} className="list-disc pl-5 space-y-1.5 marker:text-deep-purple">
              {lines.map((l, j) => (
                <li key={j}>{l.replace(bulletRe, "")}</li>
              ))}
            </ul>
          );
        }
        // Mixed block: check if it ends with bullets (e.g., "Details:\n- ...")
        const firstBulletIdx = lines.findIndex((l) => bulletRe.test(l));
        if (firstBulletIdx > 0) {
          const heading = lines.slice(0, firstBulletIdx).join(" ");
          const bullets = lines.slice(firstBulletIdx);
          return (
            <div key={i}>
              <p className="mb-2">{heading}</p>
              <ul className="list-disc pl-5 space-y-1.5 marker:text-deep-purple">
                {bullets.map((l, j) => (
                  <li key={j}>{l.replace(bulletRe, "")}</li>
                ))}
              </ul>
            </div>
          );
        }
        return (
          <p key={i}>{lines.join(" ")}</p>
        );
      })}
    </div>
  );
}

/**
 * Per-product visible main description overrides, keyed by Shopify product handle.
 * Use this when the Shopify description contains extra sections (size chart,
 * care instructions) that we want to hide from the main copy area and only
 * surface via the collapsible accordions below.
 */
const PRODUCT_DESCRIPTION_OVERRIDES: Record<string, string> = {
  "pause-please-i-m-thinking-kids-t-shirt": `Some children need extra time to process language, organize their thoughts, and find the words they want to use. This kids T-shirt shares that message in a simple, child-friendly way: Pause please… I'm thinking.

Designed for everyday wear, DLD awareness, school events, therapy sessions, and advocacy days, this shirt is a gentle reminder that giving children time can help them show what they know.

Details:
- Small left-chest design
- Available in White and Ash Grey
- Kids crewneck fit
- Soft, comfortable feel for everyday wear`,
  "1-in-14-dld-awareness-tote-bag": `Start meaningful conversations about DLD wherever you go. This natural canvas tote was created to help raise awareness of Developmental Language Disorder in a simple, everyday way.

The design highlights a few important truths about DLD:
- Lifelong
- Smart
- Neurodivergent
- 7x more common than autism

With the message "1 in 14. Have you heard of DLD?", this tote can gently open the door for conversations with other parents, educators, and community members.

Perfect for school drop-off, library trips, therapy materials, groceries, books, and everyday errands.`,
  "my-ideas-are-worth-waiting-for-kids-water-bottle": `A child-friendly water bottle with a powerful reminder: My ideas are worth waiting for.

This 17oz stainless steel water bottle was created for children who may need extra time to process language, organize their thoughts, and share what they know. The design is bright, encouraging, and easy for kids to connect with. It is a gentle reminder that their ideas matter, even when words take a little longer.

Perfect for school, therapy sessions, tutoring, camp, sports, and everyday use.

Product details:
- 17oz stainless steel water bottle
- Double-wall insulation keeps drinks hot or cold for up to 6 hours
- Leak-proof cap
- Lightweight and easy to carry
- Hand wash only, not dishwasher recommended`,
};


const MerchProductDetail = ({ product }: Props) => {
  const navigate = useNavigate();
  const addItem = useMerchCartStore((state) => state.addItem);
  const openCart = useMerchCartStore((state) => state.openCart);
  const isLoading = useMerchCartStore((state) => state.isLoading);

  const options = product.options || [];
  const variants = useMemo(
    () => product.variants.edges.map((e) => e.node),
    [product.variants.edges]
  );

  const images = useMemo(
    () => getProductImages(product),
    [product]
  );

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const activeImage = images[activeImageIndex] ?? images[0];

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    options.forEach((option) => {
      initial[option.name] = option.values[0] || "";
    });
    return initial;
  });

  const [qty, setQty] = useState(1);

  const selectedVariant = useMemo(() => {
    return variants.find((variant) =>
      variant.selectedOptions.every(
        (option) => selectedOptions[option.name] === option.value
      )
    );
  }, [variants, selectedOptions]);

  const { intro, sizeGuide, careInstructions } = useMemo(() => {
    const override = PRODUCT_DESCRIPTION_OVERRIDES[product.handle];
    if (override) {
      const parsed = splitProductDescription(product.description);
      return {
        intro: override,
        sizeGuide: parsed.sizeGuide,
        careInstructions: parsed.careInstructions,
      };
    }
    return splitProductDescription(product.description);
  }, [product.description, product.handle]);

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
  };

  const handleAdd = async () => {
    if (!selectedVariant) return;
    await addItem({
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: qty,
      selectedOptions: selectedVariant.selectedOptions,
    });
    toast.success("Added to cart", {
      description: `${getMerchDisplayTitle(product.handle, product.title)} (${selectedVariant.title})`,
    });
    openCart();
  };

  return (
    <section className="py-10 md:py-16 bg-background">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-muted-foreground hover:text-foreground mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to all merch
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Gallery */}
          <div>
            <div className="rounded-2xl overflow-hidden bg-muted aspect-[4/5]">
              {activeImage ? (
                <img
                  src={activeImage.url}
                  alt={activeImage.altText || product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[14px]">
                  No image
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-5 gap-3">
                {images.map((img, i) => {
                  const active = i === activeImageIndex;
                  return (
                    <button
                      key={img.url + i}
                      type="button"
                      onClick={() => setActiveImageIndex(i)}
                      aria-label={`View image ${i + 1}`}
                      aria-current={active}
                      className={`relative rounded-lg overflow-hidden bg-muted aspect-square border-2 transition-colors ${
                        active
                          ? "border-foreground"
                          : "border-transparent hover:border-foreground/30"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.altText || `${product.title} thumbnail ${i + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">
              MERCH
            </p>
            <h1 className="text-[28px] md:text-[36px] lg:text-[40px] font-black text-foreground leading-[1.1] mb-3">
              <MerchProductTitle handle={product.handle} title={product.title} />
            </h1>
            <p className="text-[24px] md:text-[28px] font-bold text-foreground mb-7">
              {formatShopifyPrice(
                selectedVariant?.price.amount || product.priceRange.minVariantPrice.amount,
                selectedVariant?.price.currencyCode || product.priceRange.minVariantPrice.currencyCode
              )}
            </p>

            {intro && (
              <div className="mb-7">
                <FormattedText text={intro} />
              </div>
            )}

            {/* Option pickers */}
            {options
              .filter(
                (option) =>
                  !(
                    option.name.toLowerCase() === "title" &&
                    option.values.length === 1 &&
                    option.values[0]?.toLowerCase() === "default title"
                  )
              )
              .map((option) => (
              <div key={option.name} className="mb-6">
                <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-foreground mb-3">
                  {option.name}
                </p>
                <div className="flex flex-wrap gap-2">
                  {option.values.map((value) => {
                    const active = selectedOptions[option.name] === value;
                    const variantForOption = variants.find((v) =>
                      v.selectedOptions.some(
                        (o) => o.name === option.name && o.value === value
                      )
                    );
                    const inStock = variantForOption?.availableForSale ?? false;
                    return (
                      <button
                        key={value}
                        onClick={() => handleOptionChange(option.name, value)}
                        disabled={!inStock}
                        className={`min-w-[52px] h-11 px-4 rounded-md text-[13px] font-semibold border transition-colors ${
                          active
                            ? "bg-foreground text-background border-foreground"
                            : "bg-background text-foreground border-border hover:border-foreground/50"
                        } disabled:opacity-40 disabled:cursor-not-allowed`}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Qty */}
            <div className="mb-7">
              <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-foreground mb-3">
                Quantity
              </p>
              <div className="inline-flex items-center bg-background rounded-md border border-border">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="h-11 w-11 text-foreground hover:bg-muted"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-10 text-center text-[14px] font-semibold">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="h-11 w-11 text-foreground hover:bg-muted"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <Button
              onClick={handleAdd}
              disabled={isLoading || !selectedVariant || !selectedVariant.availableForSale}
              className="w-full sm:w-auto h-12 px-10 bg-deep-purple text-white hover:bg-deep-purple/90 font-semibold text-[14px]"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Add to Cart
            </Button>

            {/* Trust strip */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-border/50">
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-[13px] font-semibold text-foreground">Printed locally</p>
                  <p className="text-[12px] text-muted-foreground">By vendors near you.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-[13px] font-semibold text-foreground">Ships worldwide</p>
                  <p className="text-[12px] text-muted-foreground">5 to 10 business days.</p>
                </div>
              </div>
            </div>

            {/* Size Guide + Care Instructions + Shipping & Returns */}
            <Accordion type="single" collapsible className="mt-8 border-t border-border/50">
              {sizeGuide && (
                <AccordionItem value="size-guide">
                  <AccordionTrigger className="text-[13px] font-bold uppercase tracking-[0.15em]">
                    Size Guide
                  </AccordionTrigger>
                  <AccordionContent>
                    <FormattedText text={sizeGuide} />
                  </AccordionContent>
                </AccordionItem>
              )}
              {careInstructions && (
                <AccordionItem value="care-instructions">
                  <AccordionTrigger className="text-[13px] font-bold uppercase tracking-[0.15em]">
                    Care Instructions
                  </AccordionTrigger>
                  <AccordionContent>
                    <FormattedText text={careInstructions} />
                  </AccordionContent>
                </AccordionItem>
              )}
              <AccordionItem value="shipping-returns">
                <AccordionTrigger className="text-[13px] font-bold uppercase tracking-[0.15em]">
                  Shipping &amp; Returns
                </AccordionTrigger>
                <AccordionContent>
                  <FormattedText
                    text={`Every item is printed on demand and made just for you, which helps reduce waste.

Production typically takes 2 to 5 business days before your order ships.

Shipping times after dispatch:
- North America: 3 to 7 business days
- Europe: 5 to 10 business days
- Rest of world: 7 to 14 business days

Because each piece is made to order, we cannot accept returns for change of mind or incorrect size. Please review the Size Guide before ordering.

If your item arrives damaged, defective, or incorrect, contact us within 14 days of delivery at hello@empowereddld.com with a photo and your order number and we will make it right.`}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MerchProductDetail;
