const packages = [
  {
    name: "Self-Guided Kit",
    price: "$1,500",
    bestFor: "Schools ready to lead their own DLD awareness initiative.",
    items: [
      "Complete DLD Book Series (all 5 titles)",
      "Discussion guides for all 5 books",
      "Classroom accommodation strategy guide",
      "DLD Awareness Display with facilitation guide",
      "Professional Resource Library access (1 year)",
    ],
  },
  {
    name: "Guided Training",
    price: "$2,800",
    bestFor: "Schools that want hands-on support building DLD awareness across staff.",
    items: [
      "Everything in the Self-Guided Kit",
      "Pre-session consultation to tailor training to your team",
      "60-90 minute interactive professional development session",
      "30-day follow-up check-in call",
    ],
  },
  {
    name: "Full Partnership",
    price: "$4,500",
    bestFor: "Schools launching a comprehensive DLD initiative with staff and family support.",
    items: [
      "Everything in the Guided Training package",
      "Parent/family workshop (virtual)",
      "IEP Goal Bank access for your SLP team",
      "Two check-in calls over 12 months",
    ],
  },
];

const ImplementationPackagesSection = () => {
  return (
    <section id="implementation-packages" className="py-10 md:py-16 lg:py-[120px]">
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
                  href="/contact"
                  className="inline-flex items-center justify-center h-12 px-8 border border-foreground text-foreground text-[11px] md:text-[12px] font-bold uppercase tracking-[0.12em] hover:bg-foreground hover:text-background transition-colors duration-200 w-full"
                >
                  Contact Us
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-[700px] mx-auto text-center">
          <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.7] mb-2">
            Additional book copies available at school pricing. Shipping covered by school.
          </p>
          <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.7]">
            Working with multiple sites or looking for something custom?{" "}
            <a href="/contact" className="underline hover:text-foreground transition-colors">
              Contact us
            </a>{" "}
            to discuss enterprise pricing and tailored training solutions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ImplementationPackagesSection;
