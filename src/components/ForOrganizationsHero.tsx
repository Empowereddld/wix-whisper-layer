import orgHero from "@/assets/org-hero.png";

const ForOrganizationsHero = () => {
  return (
    <section className="pt-6 md:pt-10 lg:pt-16 pb-14 md:pb-16 lg:pb-16">
      <div className="container px-6 md:px-8">
        <div className="relative">
          {/* Gray card background */}
          <div className="bg-muted rounded-xl lg:rounded-2xl lg:w-[58%] py-10 md:py-14 lg:py-24 px-6 md:px-8 lg:px-16">
            <span className="inline-block bg-deep-purple text-deep-purple-foreground text-[12px] md:text-[14px] lg:text-[16px] font-bold uppercase tracking-[0.14em] px-6 md:px-8 py-2 md:py-2.5 rounded-sm mb-4 md:mb-6">
              For Organizations
            </span>
            <h1 className="text-[30px] md:text-[36px] lg:text-[48px] font-black text-foreground leading-[1.12] mb-4 md:mb-5 max-w-[500px]">
              DLD Support for Your Organization
            </h1>
            <p className="text-[13px] md:text-[14px] lg:text-[15px] text-muted-foreground leading-[1.7] mb-6 md:mb-8 max-w-[500px]">
              We partner with schools, districts, clinics, and community organizations to bring DLD awareness, training, and resources where they're needed most.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center justify-center h-12 md:h-14 px-8 md:px-10 bg-black text-white text-[11px] md:text-[12px] lg:text-[13px] font-bold uppercase tracking-[0.12em] rounded-sm hover:bg-black/85 transition-colors duration-200"
            >
              Book a Consultation
            </a>
          </div>

          {/* Image — overlaps the card on the right */}
          <div className="mt-4 md:mt-6 lg:mt-0 lg:absolute lg:right-0 lg:top-0 lg:bottom-0 lg:w-[48%] rounded-xl lg:rounded-l-xl lg:rounded-r-none overflow-hidden shadow-lg max-h-[260px] md:max-h-[380px] lg:max-h-none">
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
