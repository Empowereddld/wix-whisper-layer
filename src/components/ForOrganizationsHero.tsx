import orgHero from "@/assets/org-hero.webp";

const ForOrganizationsHero = () => {
  return (
    <section className="pt-6 md:pt-10 lg:pt-16 pb-14 md:pb-16 lg:pb-16">
      <div className="container px-6 md:px-8">
        <div className="flex flex-col lg:flex-row lg:items-stretch lg:gap-6">
          {/* Gray card background */}
          <div className="bg-muted rounded-xl lg:rounded-2xl lg:w-[58%] lg:flex-shrink-0 pt-0 pb-10 md:pb-14 lg:pb-24 px-6 md:px-8 lg:px-16">
            <div className="bg-[hsl(270,60%,22%)] rounded-t-xl lg:rounded-t-2xl -mx-6 md:-mx-8 lg:-mx-16 px-8 md:px-10 lg:px-16 py-5 md:py-6 lg:py-7 mb-10 md:mb-12 lg:mb-[48px] border-b-[3px] border-white/10">
              <span className="text-white text-[20px] md:text-[22px] lg:text-[24px] font-bold uppercase tracking-[0.18em]">
                For Organizations and Non-Profits
              </span>
            </div>
            <h1 className="text-[30px] md:text-[36px] lg:text-[48px] font-black text-foreground leading-[1.12] mb-4 md:mb-5 max-w-[500px]">
              For Organizations and Non-Profits
            </h1>
            <p className="text-[13px] md:text-[14px] lg:text-[15px] text-muted-foreground leading-[1.7] mb-6 md:mb-8 max-w-[500px]">
              We train your staff and educate the families you serve about Developmental Language Disorder. From one-time workshops to comprehensive partnerships.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center h-12 md:h-14 px-8 md:px-10 bg-black text-white text-[11px] md:text-[12px] lg:text-[13px] font-bold uppercase tracking-[0.12em] rounded-sm hover:bg-black/85 transition-colors duration-200"
            >
              Book a Consultation
            </a>
          </div>

          {/* Image */}
          <div className="mt-4 lg:mt-0 lg:flex-1 rounded-xl overflow-hidden shadow-lg max-h-[260px] md:max-h-[380px] lg:max-h-none">
            <img
              src={orgHero}
              alt="Organization team meeting around a table"
              className="w-full h-full object-cover object-[center_30%] aspect-[16/9] lg:aspect-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForOrganizationsHero;
