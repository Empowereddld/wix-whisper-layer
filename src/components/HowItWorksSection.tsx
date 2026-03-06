import step1Img from "@/assets/educators-step-1.png";
import step2Img from "@/assets/educators-step-2.png";
import step3Img from "@/assets/educators-step-3.png";
import step4Img from "@/assets/educators-step-4.png";

const steps = [
  {
    number: "01",
    title: "Book a Free Consultation",
    description: "Schedule a 30-minute call to discuss your school's needs, student population, and goals. We'll help you determine which package is the best fit.",
    image: step1Img,
    alt: "Person on a phone consultation",
  },
  {
    number: "02",
    title: "Choose Your Implementation Package",
    description: "Select the level of support that works for your school — from resource-only to full staff and family programming. We'll customize the details together.",
    image: step2Img,
    alt: "Man reviewing materials at desk",
  },
  {
    number: "03",
    title: "Schedule Training & Delivery",
    description: "We'll coordinate professional development sessions, ship physical materials, and set up your digital resource access. Everything arrives ready to use.",
    image: step3Img,
    alt: "Family meeting with teacher",
  },
  {
    number: "04",
    title: "Implement with Ongoing Support",
    description: "Launch your DLD initiative with confidence. Our team provides follow-up consultations, check-in calls, and priority support to ensure long-term success.",
    image: step4Img,
    alt: "Children learning in classroom",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-10 md:py-16 lg:py-[120px] bg-muted">
      <div className="container px-6 md:px-8">
        <h2 className="text-[28px] md:text-[38px] lg:text-[46px] font-black text-foreground leading-[1.1] mb-8 md:mb-12 lg:mb-16 text-center">
          How It Works
        </h2>

        <div className="flex flex-col gap-10 md:gap-14 lg:gap-20">
          {steps.map((step, index) => {
            const isEven = index % 2 === 1;
            return (
              <div
                key={step.number}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center ${isEven ? "lg:direction-rtl" : ""}`}
              >
                <div className={`rounded-xl overflow-hidden ${isEven ? "lg:order-2" : ""}`}>
                  <img
                    src={step.image}
                    alt={step.alt}
                    className="w-full h-auto object-cover aspect-[16/9] md:aspect-[4/3] max-h-[250px] md:max-h-[320px] lg:max-h-none"
                  />
                </div>
                <div className={isEven ? "lg:order-1" : ""}>
                  <span className="text-primary text-[14px] md:text-[16px] font-bold tracking-[0.1em] uppercase mb-2 block">
                    Step {step.number}
                  </span>
                  <h3 className="text-[22px] md:text-[28px] lg:text-[34px] font-black text-foreground leading-[1.15] mb-4">
                    {step.title}
                  </h3>
                  <p className="text-[13px] md:text-[14px] lg:text-[15px] text-muted-foreground leading-[1.7] max-w-[500px]">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
