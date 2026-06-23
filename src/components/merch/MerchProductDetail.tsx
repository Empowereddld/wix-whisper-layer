import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Truck, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMerchCart } from "@/contexts/MerchCartContext";
import { formatMerchPrice, type MerchProduct } from "@/data/merchPlaceholders";
import { toast } from "sonner";

interface Props {
  product: MerchProduct;
}

const MerchProductDetail = ({ product }: Props) => {
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const { addItem, openCart } = useMerchCart();

  const selectedVariant = product.variants.find((v) => v.id === variantId);

  const handleAdd = () => {
    if (!selectedVariant) return;
    addItem(
      {
        productHandle: product.handle,
        title: product.title,
        variantId: selectedVariant.id,
        variantLabel: `${product.variantLabel}: ${selectedVariant.label}`,
        price: product.price,
        image: product.image,
      },
      qty
    );
    toast.success(`Added to cart`, { description: `${product.title} (${selectedVariant.label})` });
    openCart();
  };

  return (
    <section className="py-10 md:py-16 bg-background">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8">
        <Link
          to="/shop/merch"
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-muted-foreground hover:text-foreground mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to all merch
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Gallery */}
          <div className="rounded-2xl overflow-hidden bg-muted">
            <img
              src={product.image}
              alt={product.title}
              width={1024}
              height={1024}
              className="w-full h-auto object-cover aspect-square"
            />
          </div>

          {/* Info */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">
              MERCH
            </p>
            <h1 className="text-[28px] md:text-[36px] lg:text-[40px] font-black text-foreground leading-[1.1] mb-3">
              {product.title}
            </h1>
            <p className="text-[15px] md:text-[16px] text-muted-foreground mb-5">
              {product.tagline}
            </p>
            <p className="text-[24px] md:text-[28px] font-bold text-foreground mb-7">
              {formatMerchPrice(product.price)}
            </p>

            <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.75] mb-7">
              {product.description}
            </p>

            {/* Variant picker */}
            <div className="mb-6">
              <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-foreground mb-3">
                {product.variantLabel}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => {
                  const active = v.id === variantId;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setVariantId(v.id)}
                      disabled={!v.inStock}
                      className={`min-w-[52px] h-11 px-4 rounded-md text-[13px] font-semibold border transition-colors ${
                        active
                          ? "bg-foreground text-background border-foreground"
                          : "bg-background text-foreground border-border hover:border-foreground/50"
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                      {v.label}
                    </button>
                  );
                })}
              </div>
            </div>

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
              className="w-full sm:w-auto h-12 px-10 bg-deep-purple text-white hover:bg-deep-purple/90 font-semibold text-[14px]"
            >
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default MerchProductDetail;
