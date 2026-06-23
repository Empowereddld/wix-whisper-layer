import { Link } from "react-router-dom";
import { merchPlaceholders, formatMerchPrice } from "@/data/merchPlaceholders";

const MerchProductGrid = () => {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {merchPlaceholders.map((product) => (
            <Link
              key={product.handle}
              to={`/shop/merch/${product.handle}`}
              className="group flex flex-col bg-muted rounded-xl border border-border/40 overflow-hidden pb-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="relative aspect-square overflow-hidden bg-white">
                <img
                  src={product.image}
                  alt={product.title}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-deep-purple text-white text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full">
                    {product.badge}
                  </span>
                )}
              </div>
              <div className="px-6 pt-5 flex flex-col flex-1">
                <h3 className="text-[18px] md:text-[20px] font-bold text-foreground leading-tight mb-1">
                  {product.title}
                </h3>
                <p className="text-[13px] md:text-[14px] text-muted-foreground leading-relaxed mb-4 flex-1">
                  {product.tagline}
                </p>
                <p className="text-[16px] md:text-[17px] font-bold text-foreground">
                  {formatMerchPrice(product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MerchProductGrid;
