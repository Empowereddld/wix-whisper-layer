import { Check } from "lucide-react";
import familyDinner from "@/assets/family-dinner-new.png";

const trustPoints = [
  {
    title: "You're not figuring this out alone",
    description: "Join 4,000+ parents in our supportive community. Learn from each other and from experts who understand DLD",
  },
  {
    title: "Created by a teacher and an SLP",
    description: "Real-world classroom and parenting experience combined with clinical speech-language pathology expertise",
  },
  {
    title: "Your child will see themself in our resources",
    description: "That magical moment when your child finally stops feeling alone and connects with a character",
  },
  {
    title: "Practical strategies you can use",
    description: "No complicated jargon. Just clear, actionable tools to help your child at home, at school, and in daily life",
  },
];

const WhyParentsTrustSection = () => {
  return (
    <section className="py-16 lg:py-[120px] bg-lavender">
      <div className="container px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-10 lg:gap-16 items-start">
          {/* Left — heading + checklist */}
          <div>
            <h2 className="text-[28px] md:text-[46px] font-black text-foreground leading-[1.12] mb-10">
              Why Parents Trust Empowered DLD
            </h2>

            <div className="flex flex-col gap-6">
              {trustPoints.map((point) => (
                <div key={point.title} className="flex gap-3 items-start">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 stroke-[2.5]" />
                  <div>
                    <p className="text-[14px] md:text-[15px] font-semibold text-foreground mb-1">
                      {point.title}
                    </p>
                    <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.7]">
                      {point.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — image */}
          <div className="rounded-xl overflow-hidden">
            <img
              src={familyDinner}
              alt="A family enjoying dinner together"
              className="w-full h-auto object-cover aspect-[4/5] max-h-[400px] lg:max-h-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyParentsTrustSection;
