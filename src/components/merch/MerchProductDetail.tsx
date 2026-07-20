import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Truck, Package, Loader2 } from "lucide-react";
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
  type ShopifyProduct,
} from "@/lib/shopify";
import { toast } from "sonner";

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
    () => product.images.edges.map((e) => e.node).filter((n) => !!n?.url),
    [product.images.edges]
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

  const { intro, sizeGuide, careInstructions } = useMemo(
    () => splitProductDescription(product.description),
    [product.description]
  );

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
      description: `${product.title} (${selectedVariant.title})`,
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
            <div className="rounded-2xl overflow-hidden bg-muted">
              {activeImage ? (
                <img
                  src={activeImage.url}
                  alt={activeImage.altText || product.title}
                  width={1024}
                  height={1024}
                  className="w-full h-auto object-cover aspect-square"
                />
              ) : (
                <div className="w-full aspect-square bg-muted flex items-center justify-center text-muted-foreground text-[14px]">
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
              {product.title}
            </h1>
            <p className="text-[24px] md:text-[28px] font-bold text-foreground mb-7">
              {formatShopifyPrice(
                selectedVariant?.price.amount || product.priceRange.minVariantPrice.amount,
                selectedVariant?.price.currencyCode || product.priceRange.minVariantPrice.currencyCode
              )}
            </p>

            {intro && (
              <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.75] mb-7 whitespace-pre-line">
                {intro}
              </p>
            )}

            {/* Option pickers */}
            {options.map((option) => (
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
                  <p className="text-[13px] font-semibold text-foreground">Printed on demand</p>
                  <p className="text-[12px] text-muted-foreground">Made just for you, less waste.</p>
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

            {/* Size Guide + Care Instructions */}
            {(sizeGuide || careInstructions) && (
              <Accordion type="single" collapsible className="mt-8 border-t border-border/50">
                {sizeGuide && (
                  <AccordionItem value="size-guide">
                    <AccordionTrigger className="text-[13px] font-bold uppercase tracking-[0.15em]">
                      Size Guide
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="text-[14px] text-muted-foreground leading-[1.75] whitespace-pre-line">
                        {sizeGuide}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
                {careInstructions && (
                  <AccordionItem value="care-instructions">
                    <AccordionTrigger className="text-[13px] font-bold uppercase tracking-[0.15em]">
                      Care Instructions
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="text-[14px] text-muted-foreground leading-[1.75] whitespace-pre-line">
                        {careInstructions}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MerchProductDetail;
