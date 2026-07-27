import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { formatShopifyPrice, getFirstImage, shopifyImageUrl } from "@/lib/shopify";
import { MerchProductTitle } from "./MerchProductTitle";

const MerchProductGrid = () => {
  const { data: products, isLoading, error } = useShopifyProducts();

  return (
    <section id="shop" className="py-16 md:py-24 bg-background">
      <div className="max-w-[1300px] mx-auto px-6 md:px-8">
        <div className="mb-10 md:mb-14">
          <p className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">
            THE COLLECTION
          </p>
          <h2 className="text-[28px] md:text-[36px] lg:text-[42px] font-black text-foreground leading-[1.1]">
            Browse Our Merch
          </h2>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && !isLoading && (
          <div className="text-center py-16">
            <p className="text-[15px] font-semibold text-foreground mb-2">Could not load products</p>
            <p className="text-[13px] text-muted-foreground">{error.message}</p>
          </div>
        )}

        {!isLoading && !error && (!products || products.length === 0) && (
          <div className="text-center py-16 px-6 bg-muted/40 rounded-xl border border-border/40">
            <p className="text-[18px] md:text-[20px] font-bold text-foreground mb-2">
              No products found
            </p>
            <p className="text-[14px] md:text-[15px] text-muted-foreground max-w-md mx-auto">
              Your Shopify store is connected, but it does not have any products yet. Tell me what you want to sell first — for example, the Empowered DLD tee, mug, or tote — and I will add it to your store.
            </p>
          </div>
        )}

        {!isLoading && !error && products && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((product) => {
              const node = product.node;
              const image = getFirstImage(node);
              return (
                <Link
                  key={node.handle}
                  to={`/shop/merch/${node.handle}`}
                  className="group flex flex-col bg-muted rounded-xl border border-border/40 overflow-hidden pb-6 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="relative aspect-square overflow-hidden bg-white">
                    {image ? (
                      <img
                        src={shopifyImageUrl(image, 700)}
                        alt={node.title}
                        loading="lazy"
                        width={700}
                        height={700}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-[13px]">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="px-6 pt-5 flex flex-col flex-1">
                    <h3 className="text-[18px] md:text-[20px] font-bold text-foreground leading-tight mb-1">
                      <MerchProductTitle handle={node.handle} title={node.title} />
                    </h3>
                    <p className="text-[13px] md:text-[14px] text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-3">
                      {node.description || "Shop DLD awareness merch."}
                    </p>
                    <p className="text-[16px] md:text-[17px] font-bold text-foreground">
                      {formatShopifyPrice(
                        node.priceRange.minVariantPrice.amount,
                        node.priceRange.minVariantPrice.currencyCode
                      )}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default MerchProductGrid;
