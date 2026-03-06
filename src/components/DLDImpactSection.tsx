import { BarChart3, GraduationCap, BookOpen, Briefcase, Heart, Handshake } from "lucide-react";

const cards = [
  {
    icon: BarChart3,
    title: "1 in 14 children has DLD",
    description: "More common than autism, yet significantly under-recognized in schools and communities.",
  },
  {
    icon: GraduationCap,
    title: "70% aren't identified",
    description: "Most children with DLD slip through the cracks without proper support or understanding.",
  },
  {
    icon: BookOpen,
    title: "It impacts reading, writing, and learning",
    description: "DLD affects academics across all subjects, not just language arts.",
  },
  {
    icon: Briefcase,
    title: "Long-term employment challenges",
    description: "Without support, many adults with DLD face ongoing communication and workplace difficulties.",
  },
  {
    icon: Heart,
    title: "Social and emotional impact",
    description: "Children with DLD often struggle with friendships, self-esteem, and mental health.",
  },
  {
    icon: Handshake,
    title: "Families need help understanding",
    description: "Parents and caregivers often don't know how to support their child's language needs.",
  },
];

const DLDImpactSection = () => {
  return (
    <section className="py-10 md:py-16 lg:py-[120px]">
      <div className="container px-6 md:px-8">
        <div className="mb-8 md:mb-10 lg:mb-14">
          <h2 className="text-[28px] md:text-[38px] lg:text-[46px] font-black text-foreground leading-[1.1] mb-3">
            DLD is Affecting the Communities You Serve
          </h2>
          <p className="text-[13px] md:text-[14px] lg:text-[16px] text-muted-foreground leading-[1.7] max-w-[650px]">
            Developmental Language Disorder (DLD) affects 1 in 14 children, yet most people have never heard of it. Your organization can change that.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="bg-lavender border border-border/30 rounded-lg p-6 md:p-8 lg:p-10 flex flex-col min-h-[220px] md:min-h-[260px]"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-[18px] md:text-[20px] font-black text-foreground mb-3">
                  {card.title}
                </h3>
                <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.7]">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DLDImpactSection;
