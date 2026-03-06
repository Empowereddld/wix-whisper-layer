import { ChevronRight } from "lucide-react";

const cards = [
  {
    title: "Parent Workshops",
    description: "Live workshops and recorded sessions to help parents understand DLD and support their child with confidence.",
    link: "See Workshop Topics",
    href: "#",
  },
  {
    title: "Staff Training",
    description: "Professional development for educators, SLPs, and support staff on recognizing and supporting DLD in the classroom.",
    link: "Explore Training",
    href: "#",
  },
  {
    title: "Resource Packages",
    description: "Bulk book orders and printable resources you can share with families, teachers, and clinicians across your organization.",
    link: "View Resources",
    href: "#",
  },
  {
    title: "Custom Partnerships",
    description: "Tailored programs designed specifically for your school, district, clinic, or community organization's unique needs.",
    link: "Build a Partnership",
    href: "#",
  },
];

const HowWeSupportOrganizationsSection = () => {
  return (
    <section className="py-10 md:py-16 lg:py-[120px] bg-muted">
      <div className="container px-6 md:px-8">
        <div className="mb-8 md:mb-10 lg:mb-14">
          <h2 className="text-[28px] md:text-[38px] lg:text-[46px] font-black text-foreground leading-[1.1] mb-3">
            How We Support Your Organization
          </h2>
          <p className="text-[13px] md:text-[14px] lg:text-[16px] text-muted-foreground leading-[1.7] max-w-[650px]">
            From workshops to books to community support, we're here to help you help your families.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 lg:gap-8">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-lavender border border-border/30 rounded-lg p-6 md:p-8 lg:p-10 flex flex-col min-h-[220px] md:min-h-[260px]"
            >
              <div>
                <h3 className="text-[18px] md:text-[20px] font-black text-foreground mb-4">
                  {card.title}
                </h3>
                <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.7]">
                  {card.description}
                </p>
              </div>
              <a
                href={card.href}
                className="inline-flex items-center gap-1 text-[11px] md:text-[12px] font-bold uppercase tracking-[0.12em] text-foreground hover:text-primary transition-colors mt-6"
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

export default HowWeSupportOrganizationsSection;
