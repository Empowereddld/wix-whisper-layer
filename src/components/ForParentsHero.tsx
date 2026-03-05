import motherDaughterReading from "@/assets/mother-daughter-reading.png";

const ForParentsHero = () => {
  return (
    <section className="py-14 md:py-20">
      <div className="container px-6 md:px-8">
        <div className="relative">
          {/* Gray card background */}
          <div className="bg-muted/60 rounded-xl md:rounded-2xl md:w-[58%] py-14 md:py-20 px-8 md:px-16">
            <span className="inline-block bg-deep-purple text-deep-purple-foreground text-[14px] md:text-[16px] font-bold uppercase tracking-[0.14em] px-8 py-2.5 rounded-sm mb-6">
              For Parents
            </span>
            <h1 className="text-[30px] md:text-[46px] font-black text-foreground leading-[1.12] mb-5 max-w-[480px]">
              Does Your Child Struggle to Express Themself?
            </h1>
            <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.7] mb-8 max-w-[440px]">
              Join 4,000+ parents learning about language challenges, gaining practical strategies, and discovering they're not alone.
            </p>
            <a
              href="#"
              className="inline-flex items-center justify-center h-12 px-8 bg-black text-white text-[12px] md:text-[13px] font-bold uppercase tracking-[0.12em] rounded-sm hover:bg-black/85 transition-colors duration-200"
            >
              Join Our Community
            </a>
          </div>

          {/* Image — overlaps the card on the right */}
          <div className="mt-6 md:mt-0 md:absolute md:right-0 md:top-0 md:bottom-0 md:w-[48%] rounded-xl md:rounded-l-xl md:rounded-r-none overflow-hidden shadow-lg">
            <img
              src={motherDaughterReading}
              alt="A mother and daughter reading together"
              className="w-full h-full object-cover aspect-[4/3] md:aspect-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForParentsHero;
