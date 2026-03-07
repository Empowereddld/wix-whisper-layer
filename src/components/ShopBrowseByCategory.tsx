import { Link } from "react-router-dom";
import shopBooksImg from "@/assets/shop-books.png";
import shopBulkImg from "@/assets/shop-bulk-orders.png";
import shopMerchImg from "@/assets/shop-merch.png";

const categories = [
  {
    label: "BOOKS",
    title: "Living Life with DLD Books",
    description:
      "Diverse, relatable stories featuring characters with DLD. The only series of its kind, written by an SLP and a teacher.",
    image: shopBooksImg,
    cta: "Shop Books",
    href: "/shop/books",
  },
  {
    label: "BULK ORDERS",
    title: "Package Sets",
    description:
      "Bring DLD representation to your whole school, clinic, or organization. Discounted rates available for orders of any size.",
    image: shopBulkImg,
    cta: "Order in Bulk",
    href: "/shop/bulk-orders",
  },
  {
    label: "MERCH",
    title: "DLD Awareness Merch",
    description:
      "Wear it. Share it. Start the conversation. Stuffies, bracelets, and more for families spreading DLD awareness.",
    image: shopMerchImg,
    cta: "Shop Merch",
    href: "/shop/merch",
    comingSoon: true,
  },
];

const ShopBrowseByCategory = () => {
  return (
    <section className="py-16 md:py-24 lg:py-28">
      <div className="max-w-[1100px] mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="mb-10 md:mb-14">
          <p className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">
            BROWSE BY CATEGORY
          </p>
          <h2 className="text-[28px] md:text-[36px] lg:text-[42px] font-black text-foreground leading-[1.1] mb-3">
            Find What You're Looking For
          </h2>
          <p className="text-[15px] md:text-[16px] text-muted-foreground leading-relaxed max-w-[500px]">
            Each section has resources designed specifically for you.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categories.map((cat) => (
            <div key={cat.label} className="flex flex-col">
              {/* Image */}
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] mb-5">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover"
                />
                {cat.comingSoon && (
                  <span className="absolute top-3 right-3 bg-destructive text-destructive-foreground text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full rotate-[12deg]">
                    Coming Soon
                  </span>
                )}
              </div>

              {/* Text */}
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-2">
                {cat.label}
              </p>
              <h3 className="text-[20px] md:text-[22px] font-bold text-foreground leading-tight mb-2">
                {cat.title}
              </h3>
              <p className="text-[14px] md:text-[15px] text-muted-foreground leading-relaxed mb-6 flex-1">
                {cat.description}
              </p>

              {/* CTA */}
              <Link
                to={cat.href}
                className="inline-flex items-center justify-center h-11 px-7 bg-foreground text-background text-[13px] font-semibold tracking-[0.04em] rounded-md hover:opacity-90 transition-opacity duration-200 w-fit"
              >
                {cat.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopBrowseByCategory;
