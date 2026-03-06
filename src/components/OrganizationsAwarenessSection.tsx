import orgKids from "@/assets/org-kids.png";
import orgCommunity from "@/assets/org-community.png";

const OrganizationsAwarenessSection = () => {
  return (
    <section className="py-10 md:py-16 lg:py-[120px] bg-secondary">
      <div className="container px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left — layered image composition */}
          <div className="relative h-[280px] md:h-[380px] lg:h-[450px]">
            {/* Back card */}
            <div
              className="absolute top-0 left-0 w-[70%] md:w-[72%] z-10 animate-float-gentle"
              style={{ transform: "rotate(-2deg)" }}
            >
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={orgCommunity}
                  alt="Community members collaborating together"
                  className="w-full h-auto object-cover aspect-[4/3]"
                />
              </div>
            </div>

            {/* Front card */}
            <div
              className="absolute bottom-0 right-0 w-[70%] md:w-[72%] z-20 animate-float-gentle-alt"
              style={{ transform: "rotate(1deg)" }}
            >
              <div className="rounded-2xl overflow-hidden" style={{ boxShadow: "var(--shadow-elevated)" }}>
                <img
                  src={orgKids}
                  alt="Children engaged in learning activities"
                  className="w-full h-auto object-cover aspect-[4/3]"
                />
              </div>
            </div>
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

            <div className="text-center">
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
