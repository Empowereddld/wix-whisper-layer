import orgKids from "@/assets/org-kids.png";

const OrganizationsAwarenessSection = () => {
  return (
    <section className="py-10 md:py-16 lg:py-[120px] bg-muted">
      <div className="container px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
          {/* Left — image */}
          <div className="rounded-xl overflow-hidden">
            <img
              src={orgKids}
              alt="Children learning together in a classroom"
              className="w-full h-auto object-cover aspect-[16/9] md:aspect-[4/3] lg:aspect-[4/5] max-h-[250px] md:max-h-[350px] lg:max-h-none"
            />
          </div>

          {/* Right — text */}
          <div>
            <h2 className="text-[24px] md:text-[34px] lg:text-[46px] font-black text-foreground leading-[1.12] mb-4 md:mb-6">
              Let's Spread DLD Awareness Together!
            </h2>
            <p className="text-[13px] md:text-[14px] lg:text-[15px] text-muted-foreground leading-[1.7] mb-6 md:mb-8">
              Whether you're an SLP manager overseeing a team, a principal building an inclusive school, or a community leader supporting families—we can help you create meaningful, lasting impact for children with DLD.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center justify-center h-12 md:h-14 px-8 md:px-10 bg-black text-white text-[11px] md:text-[12px] lg:text-[13px] font-bold uppercase tracking-[0.12em] rounded-sm hover:bg-black/85 transition-colors duration-200"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrganizationsAwarenessSection;
