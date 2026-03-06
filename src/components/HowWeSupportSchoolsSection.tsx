import { ChevronRight } from "lucide-react";

const cards = [
  {
    title: "Diverse Children's Books",
    description: "Our DLD book series features characters from diverse backgrounds, available in 7+ languages. Each book comes with a discussion guide and parent letter to extend learning beyond the classroom.",
    link: "Explore the Books",
    href: "#",
  },
  {
    title: "Professional Development",
    description: "Interactive training sessions for teachers, support staff, and administrators. Learn to recognize DLD, implement classroom accommodations, and support students across all subject areas.",
    link: "Learn About Training",
    href: "#",
  },
  {
    title: "Implementation Toolkit",
    description: "Everything you need to launch a DLD-aware initiative in your school: screening guides, referral pathways, accommodation checklists, and progress monitoring tools.",
    link: "View the Toolkit",
    href: "#",
  },
  {
    title: "Parent Partnership Resources",
    description: "Multilingual parent guides, workshop materials, and communication templates to help families understand DLD and participate in their child's support plan.",
    link: "See Parent Resources",
    href: "#",
  },
  {
    title: "Equity-Driven Resources",
    description: "Culturally responsive materials designed to address the disproportionate impact of DLD on multilingual learners and underserved communities.",
    link: "Explore Resources",
    href: "#",
  },
  {
    title: "Goal Bank & Digital Resources",
    description: "A comprehensive digital library of IEP goals, therapy activities, classroom strategies, and progress monitoring tools — all organized by age and skill area.",
    link: "Browse the Goal Bank",
    href: "#",
  },
];

const HowWeSupportSchoolsSection = () => {
  return (
    <section className="py-10 md:py-16 lg:py-[120px]">
      <div className="container px-6 md:px-8">
        <div className="mb-8 md:mb-10 lg:mb-14">
          <h2 className="text-[28px] md:text-[38px] lg:text-[46px] font-black text-foreground leading-[1.1] mb-3">
            How We Support Schools
          </h2>
          <p className="text-[13px] md:text-[14px] lg:text-[16px] text-muted-foreground leading-[1.7] max-w-[650px]">
            From professional development to classroom resources, we provide everything your school needs to support students with DLD.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-lavender border border-border/30 rounded-lg p-6 md:p-8 lg:p-10 flex flex-col min-h-[220px] md:min-h-[260px]"
            >
              <div>
                <h3 className="text-[20px] md:text-[24px] font-black text-foreground mb-4 text-center">
                  {card.title}
                </h3>
                <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.7]">
                  {card.description}
                </p>
              </div>
              <a
                href={card.href}
                className="inline-flex items-center gap-1 text-[11px] md:text-[12px] font-bold uppercase tracking-[0.12em] text-foreground hover:text-primary transition-colors mt-auto pt-6"
              >
                {card.link}
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowWeSupportSchoolsSection;
