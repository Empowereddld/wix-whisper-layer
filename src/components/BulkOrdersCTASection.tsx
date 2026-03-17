import bulkOrdersHero from "@/assets/bulk-orders-hero.webp";

const BulkOrdersCTASection = () => {
  return (
    <section className="py-14 md:py-20">
      <div className="max-w-[1100px] mx-auto px-6 md:px-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Image */}
          <div className="lg:w-[45%] flex-shrink-0 rounded-xl overflow-hidden">
            <img
              src={bulkOrdersHero}
              alt="Stacks of DLD children's books"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Text */}
          <div className="flex-1">
            <h2 className="text-[22px] md:text-[28px] lg:text-[32px] font-black text-foreground leading-[1.12] mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.7] max-w-[500px] mb-6">
              Join schools and organizations in 15+ countries already using the Living Life with DLD series.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center h-12 px-8 bg-deep-purple text-deep-purple-foreground text-[13px] font-semibold rounded-sm hover:bg-deep-purple/90 transition-colors duration-200"
            >
              Request a Bulk Order
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BulkOrdersCTASection;
