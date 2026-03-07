const steps = [
  {
    step: "STEP 1",
    title: "Tell Us What You Need",
    description: "Fill out our bulk order form with your organization details and the books you're interested in.",
  },
  {
    step: "STEP 2",
    title: "We'll Be in Touch",
    description: "We'll contact you within 48 hours to discuss pricing, quantities, and delivery.",
  },
  {
    step: "STEP 3",
    title: "Receive Your Order",
    description: "Your books arrive with implementation resources so you can get started right away.",
  },
];

const BulkOrdersHowItWorksSection = () => {
  return (
    <section className="py-14 md:py-20">
      <div className="max-w-[1100px] mx-auto px-6 md:px-10">
        <h2 className="text-[26px] md:text-[32px] lg:text-[38px] font-black text-foreground leading-[1.1] mb-2">
          How it works
        </h2>
        <p className="text-[14px] text-muted-foreground mb-10">
          Three Simple Steps
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((item) => (
            <div
              key={item.step}
              className="bg-muted rounded-lg p-6 text-center"
            >
              <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-foreground mb-4 text-left">
                {item.step}
              </p>
              <h3 className="text-[16px] md:text-[18px] font-bold text-foreground mb-3">
                {item.title}
              </h3>
              <p className="text-[13px] text-muted-foreground leading-[1.65]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BulkOrdersHowItWorksSection;
