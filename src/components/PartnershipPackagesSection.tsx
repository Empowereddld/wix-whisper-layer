const packages = [
  {
    name: "Community Intro Workshop",
    price: "$1,500",
    items: [
      "1-hour live virtual workshop for parents, educators, or staff",
      "Introduction to DLD and practical strategies for support",
      "Q&A session with Empowered DLD co-founders",
      "Digital handouts and resources for all participants",
      "Recording of the session for future use",
    ],
  },
  {
    name: "Full-Day In-Person Training",
    price: "$3,000",
    items: [
      "Full-day (6-hour) in-person training at your location",
      "Customized content for your audience (educators, SLPs, admin, or mixed)",
      "Interactive activities and case study discussions",
      "Resource materials for all attendees",
      "30-day email support for follow-up questions",
      "Bulk book discount for orders placed within 30 days",
    ],
  },
];

const PartnershipPackagesSection = () => {
  return (
    <section className="py-10 md:py-16 lg:py-[120px]">
      <div className="container px-6 md:px-8">
        <div className="mb-8 md:mb-10 lg:mb-14 text-center">
          <h2 className="text-[28px] md:text-[38px] lg:text-[46px] font-black text-foreground leading-[1.1] mb-3">
            Partnership Packages to Support Your Community
          </h2>
          <p className="text-[13px] md:text-[14px] lg:text-[16px] text-muted-foreground leading-[1.7] max-w-[600px] mx-auto">
            Whether you're just getting started or ready to go all-in, we've designed packages to meet you where you are.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 lg:gap-8 max-w-[900px] mx-auto">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className="border border-border rounded-lg overflow-hidden flex flex-col"
            >
              <div className="bg-deep-purple text-deep-purple-foreground px-6 py-5 text-center">
                <h3 className="text-[18px] md:text-[20px] font-black mb-1">{pkg.name}</h3>
                <p className="text-[28px] md:text-[32px] font-black">{pkg.price}</p>
              </div>
              <div className="p-6 md:p-8 flex flex-col flex-1">
                <p className="text-[13px] md:text-[14px] font-semibold text-foreground mb-3">
                  What's included:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-[13px] md:text-[14px] text-muted-foreground leading-[1.7] mb-6 flex-1">
                  {pkg.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center h-12 px-8 border border-foreground text-foreground text-[11px] md:text-[12px] font-bold uppercase tracking-[0.12em] hover:bg-foreground hover:text-background transition-colors duration-200 w-full"
                >
                  Book This Package
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnershipPackagesSection;
