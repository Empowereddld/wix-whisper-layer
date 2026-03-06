import motherDaughterReading from "@/assets/mother-daughter-reading.png";

const ForParentsHero = () => {
  return (
    <section className="pt-6 md:pt-10 lg:pt-16 pb-10 md:pb-16 lg:pb-[120px]">
      <div className="container px-6 md:px-8">
        <div className="relative">
          {/* Gray card background */}
          <div className="bg-muted rounded-xl lg:rounded-2xl lg:w-[58%] py-10 md:py-14 lg:py-24 px-6 md:px-8 lg:px-16">
            <span className="inline-block bg-deep-purple text-deep-purple-foreground text-[12px] md:text-[14px] lg:text-[16px] font-bold uppercase tracking-[0.14em] px-6 md:px-8 py-2 md:py-2.5 rounded-sm mb-4 md:mb-6">
              For Parents
            </span>
            <h1 className="text-[26px] md:text-[36px] lg:text-[48px] font-black text-foreground leading-[1.12] mb-4 md:mb-5 max-w-[500px]">
              Does Your Child Struggle to Express Themself?
            </h1>
            <p className="text-[13px] md:text-[14px] lg:text-[15px] text-muted-foreground leading-[1.7] mb-6 md:mb-8 max-w-[500px]">
              Join 4,000+ parents learning about language challenges, gaining practical strategies, and discovering they're not alone.
            </p>
            <a
              href="#"
              className="inline-flex items-center justify-center h-12 md:h-14 px-8 md:px-10 bg-black text-white text-[11px] md:text-[12px] lg:text-[13px] font-bold uppercase tracking-[0.12em] rounded-sm hover:bg-black/85 transition-colors duration-200"
            >
              Join Our Community
            </a>
          </div>

          {/* Image — overlaps the card on the right */}
          <div className="mt-4 md:mt-6 lg:mt-0 lg:absolute lg:right-0 lg:top-0 lg:bottom-0 lg:w-[48%] rounded-xl lg:rounded-l-xl lg:rounded-r-none overflow-hidden shadow-lg max-h-[220px] md:max-h-[280px] lg:max-h-none">
            <img
              src={motherDaughterReading}
              alt="A mother and daughter reading together"
              className="w-full h-full object-cover object-[center_30%] aspect-[16/9] lg:aspect-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForParentsHero;
