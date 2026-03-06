import orgKids from "@/assets/org-kids.png";

const OrganizationsAwarenessSection = () => {
  return (
    <section className="py-10 md:py-16 lg:py-[120px] bg-secondary">
      <div className="container px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left — image */}
          <div className="rounded-xl overflow-hidden">
            <img
              src={orgKids}
              alt="Diverse group of people collaborating at a table"
              className="w-full h-auto object-cover aspect-[4/5] max-h-[300px] md:max-h-[450px] lg:max-h-[560px]"
            />
          </div>

          {/* Right — text */}
          <div className="flex flex-col justify-center">
            <h2 className="text-[28px] md:text-[36px] lg:text-[46px] font-black text-foreground leading-[1.12] mb-4 md:mb-6">
              Let's spread DLD Awareness together!
            </h2>
            <p className="text-[13px] md:text-[14px] lg:text-[15px] text-muted-foreground leading-[1.7] mb-4 md:mb-5">
              We partner with organizations committed to supporting underserved families, including:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[13px] md:text-[14px] lg:text-[15px] text-muted-foreground leading-[1.7] mb-6 md:mb-8">
              <li>Family service agencies serving diverse communities</li>
              <li>Newcomer and settlement organizations</li>
              <li>EarlyON centers and family resource programs</li>
              <li>Multicultural community centers</li>
              <li>Community health centers</li>
            </ul>

            <p className="text-[14px] md:text-[15px] lg:text-[16px] font-bold text-foreground text-center mb-3">
              Let's Talk About What's Possible
            </p>
            <p className="text-[13px] md:text-[14px] lg:text-[15px] text-muted-foreground leading-[1.7] mb-6 md:mb-8">
              Book a free 30-minute consultation to discuss your organization's needs and how we can bring DLD support to your community.
            </p>

            <div>
              <a
                href="#contact"
                className="inline-flex items-center justify-center h-12 md:h-14 px-8 md:px-10 border border-foreground text-foreground text-[11px] md:text-[12px] lg:text-[13px] font-bold tracking-[0.08em] rounded-sm hover:bg-foreground hover:text-background transition-colors duration-200"
              >
                Book a Consultation
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrganizationsAwarenessSection;
