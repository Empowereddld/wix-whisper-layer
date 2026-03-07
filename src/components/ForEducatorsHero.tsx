import educatorsHero from "@/assets/educators-hero.png";

const ForEducatorsHero = () => {
  return (
    <section className="pt-6 md:pt-10 lg:pt-16 pb-14 md:pb-16 lg:pb-16">
      <div className="container px-6 md:px-8">
        <div className="flex flex-col lg:flex-row lg:items-stretch lg:gap-6">
          <div className="bg-muted rounded-xl lg:rounded-2xl lg:w-[58%] lg:flex-shrink-0 pt-0 pb-10 md:pb-14 lg:pb-24 px-6 md:px-8 lg:px-16">
            <div className="bg-deep-purple rounded-t-xl lg:rounded-t-2xl -mx-6 md:-mx-8 lg:-mx-16 px-6 md:px-8 lg:px-16 py-3 md:py-4 mb-6 md:mb-8">
              <span className="text-white text-[13px] md:text-[15px] lg:text-[17px] font-bold uppercase tracking-[0.16em]">
                For Schools and Educators
              </span>
            </div>
            <h1 className="text-[30px] md:text-[36px] lg:text-[48px] font-black text-foreground leading-[1.12] mb-4 md:mb-5 max-w-[500px]">
              Comprehensive DLD Support for Your School
            </h1>
            <p className="text-[13px] md:text-[14px] lg:text-[15px] text-muted-foreground leading-[1.7] mb-6 md:mb-8 max-w-[500px]">
              School-wide materials, staff training, and multilingual resources to support students with Developmental Language Disorder — designed by an SLP and educator team.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center justify-center h-12 md:h-14 px-8 md:px-10 bg-black text-white text-[11px] md:text-[12px] lg:text-[13px] font-bold uppercase tracking-[0.12em] rounded-sm hover:bg-black/85 transition-colors duration-200"
            >
              Book a Consultation
            </a>
          </div>

          <div className="mt-4 lg:mt-0 lg:flex-1 rounded-xl overflow-hidden shadow-lg max-h-[260px] md:max-h-[380px] lg:max-h-none">
            <img
              src={educatorsHero}
              alt="Children in a classroom learning together"
              className="w-full h-full object-cover object-[center_30%] aspect-[16/9] lg:aspect-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForEducatorsHero;
