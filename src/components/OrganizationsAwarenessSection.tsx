import orgKids from "@/assets/org-kids.webp";

const OrganizationsAwarenessSection = () => {
  return (
    <section className="py-10 md:py-16 lg:py-[80px] bg-secondary">
      <div className="container px-6 md:px-8">
        {/* Mobile-only title */}
        <h2 className="md:hidden text-[28px] font-black text-foreground leading-[1.12] mb-8">
          Let's spread DLD Awareness together!
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 lg:items-start">
          {/* Left — title + image (tablet/desktop) */}
          <div className="hidden md:flex flex-col">
            <h2 className="text-[36px] lg:text-[46px] font-black text-foreground leading-[1.12] mb-8">
              Let's spread DLD Awareness together!
            </h2>

            <div className="rounded-2xl overflow-hidden" style={{ boxShadow: "var(--shadow-elevated)" }}>
              <img
                src={orgKids}
                alt="Children engaged in learning activities"
                className="w-full h-auto object-cover object-[center_70%] lg:object-[center_60%] aspect-[4/5] max-h-[480px]"
              />
            </div>
          </div>

          {/* Right — text */}
          <div className="flex flex-col justify-center items-center md:items-start md:pt-[120px] lg:pt-[140px]">
            <p className="text-[13px] md:text-[14px] lg:text-[15px] text-muted-foreground leading-[1.7] mb-5 md:mb-6">
              We partner with organizations committed to supporting underserved families, including:
            </p>
            <ul className="list-disc pl-5 space-y-4 text-[13px] md:text-[14px] lg:text-[15px] text-muted-foreground leading-[1.7] mb-8 md:mb-10 self-start">
              <li>Family service agencies serving diverse communities</li>
              <li>Newcomer and settlement organizations</li>
              <li>EarlyON centers and family resource programs</li>
              <li>Multicultural community centers</li>
              <li>Community health centers</li>
            </ul>

            <p className="text-[14px] md:text-[15px] lg:text-[16px] font-bold text-foreground text-center mb-4 w-full">
              Let's Talk About What's Possible
            </p>
            <p className="text-[13px] md:text-[14px] lg:text-[15px] text-muted-foreground leading-[1.7] mb-8 md:mb-10">
              Book a free 30-minute consultation to discuss your organization's needs and how we can bring DLD support to your community.
            </p>

            <div className="text-center w-full">
              <a
                href="/contact"
                className="inline-flex items-center justify-center h-12 md:h-14 px-8 md:px-10 border border-foreground text-foreground text-[11px] md:text-[12px] lg:text-[13px] font-bold tracking-[0.08em] rounded-sm hover:bg-foreground hover:text-background transition-colors duration-200"
              >
                Book a Consultation
              </a>
            </div>

            {/* Mobile image — below button */}
            <div className="md:hidden mt-8 w-[60%] mx-auto">
              <div className="rounded-2xl overflow-hidden" style={{ boxShadow: "var(--shadow-elevated)" }}>
                <img
                  src={orgKids}
                  alt="Children engaged in learning activities"
                  className="w-full h-auto object-cover object-[center_70%] aspect-[4/5]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrganizationsAwarenessSection;
