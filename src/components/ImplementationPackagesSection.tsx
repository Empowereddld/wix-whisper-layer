const packages = [
  {
    name: "Resource Package",
    price: "$1,500",
    bestFor: "Schools that want high-quality DLD materials without training.",
    items: [
      "Full DLD book series (print + digital)",
      "Discussion guides for each book",
      "Parent letters in 7+ languages",
      "Classroom poster set",
      "Digital resource library access (1 year)",
    ],
  },
  {
    name: "Staff Training",
    price: "$2,800",
    bestFor: "Schools that want to build staff capacity to support students with DLD.",
    items: [
      "Everything in the Resource Package",
      "2-hour interactive professional development session",
      "DLD screening and identification guide",
      "Classroom accommodation toolkit",
      "30-day follow-up consultation",
    ],
  },
  {
    name: "Staff and Family Support",
    price: "$4,500",
    bestFor: "Schools that want a comprehensive, equity-driven DLD initiative.",
    items: [
      "Everything in Staff Training",
      "Parent workshop (virtual or in-person)",
      "Multilingual family resource packets",
      "IEP goal bank access",
      "Quarterly check-in calls (1 year)",
      "Priority email support",
    ],
  },
];

const addOns = [
  "Additional professional development sessions — $800/session",
  "Custom multilingual resource translation — $500/language",
  "On-site implementation coaching (full day) — $1,200",
];

const ImplementationPackagesSection = () => {
  return (
    <section className="py-10 md:py-16 lg:py-[120px]">
      <div className="container px-6 md:px-8">
        <div className="mb-8 md:mb-10 lg:mb-14 text-center">
          <h2 className="text-[28px] md:text-[38px] lg:text-[46px] font-black text-foreground leading-[1.1] mb-3">
            Implementation Packages
          </h2>
          <p className="text-[13px] md:text-[14px] lg:text-[16px] text-muted-foreground leading-[1.7] max-w-[600px] mx-auto">
            Choose the level of support that's right for your school.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 lg:gap-8 mb-10 md:mb-14">
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
                <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.7] mb-4">
                  <span className="font-semibold">Best for:</span> {pkg.bestFor}
                </p>
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
                  Contact Us
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Add-ons */}
        <div className="max-w-[700px] mx-auto">
          <h3 className="text-[18px] md:text-[22px] font-black text-foreground mb-4 text-center">
            Add-Ons
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-[13px] md:text-[14px] text-muted-foreground leading-[1.7]">
            {addOns.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ImplementationPackagesSection;
