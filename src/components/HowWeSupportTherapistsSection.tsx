import { ChevronRight } from "lucide-react";

const cards = [
  {
    title: "Books & Therapy Guides",
    description: "Engaging storybooks featuring characters with DLD, paired with therapy guides designed for use in sessions. Available in 7+ languages.",
    link: "Buy Now",
    href: "#",
  },
  {
    title: "Parent Resources",
    description: "Handouts and guides you can share with families to reinforce therapy goals at home. Clear, jargon-free, and available in multiple languages.",
    link: "Buy Now",
    href: "#",
  },
  {
    title: "Workshops & Training",
    description: "Professional development workshops on DLD identification, intervention strategies, and working with multilingual families.",
    link: "Learn More",
    href: "#",
  },
  {
    title: "Animated Podcast",
    description: "Short animated episodes featuring Dan and Daria discussing life with DLD. Use them in sessions to spark conversation and build awareness.",
    link: "YouTube",
    href: "#",
  },
  {
    title: "Educational App",
    description: "An interactive storytelling app designed specifically for children with DLD. Built by a team of SLPs, educators, and developers. Coming soon!",
    link: "Join Waiting List",
    href: "#",
  },
  {
    title: "Stock Your Therapy Room",
    description: "Get a complete set of Empowered DLD books and materials for your therapy room. Give your clients access to stories they can finally relate to.",
    link: "Buy Now",
    href: "#",
  },
];

const HowWeSupportTherapistsSection = () => {
  return (
    <section className="py-10 md:py-16 lg:py-[120px]">
      <div className="container px-6 md:px-8">
        <div className="mb-8 md:mb-10 lg:mb-14">
          <h2 className="text-[28px] md:text-[38px] lg:text-[46px] font-black text-foreground leading-[1.1] mb-3">
            How We Support Therapists
          </h2>
          <p className="text-[13px] md:text-[14px] lg:text-[16px] text-muted-foreground leading-[1.7] max-w-[650px]">
            Ready-to-use materials that save you time and better serve your clients.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-lavender border border-border/30 rounded-lg p-6 md:p-8 lg:p-10 flex flex-col min-h-[220px] md:min-h-[260px]"
            >
              <div>
                <h3 className="text-[20px] md:text-[24px] font-black text-foreground mb-4 text-center whitespace-nowrap">
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

export default HowWeSupportTherapistsSection;
