import { ChevronRight } from "lucide-react";

const cards = [
  {
    title: "Parent Workshops",
    description: "Get the knowledge and tools you need to confidently support your child with DLD. Connect with experts and other parents who understand.",
    link: "Join Waiting List",
    href: "#",
  },
  {
    title: "Books and Resources",
    description: "Stories featuring diverse characters with DLD your child can relate to. Available in 7+ languages with discussion guides and parent guidebook.",
    link: "Buy Now",
    href: "#",
  },
  {
    title: "Free Community",
    description: "Connect with 4000+ parents and professionals to ask questions, share strategies, and find support in our private Facebook community.",
    link: "Join Here",
    href: "#",
  },
  {
    title: "Free Resources",
    description: "Free downloadable guides, checklists, and practical tools to help you advocate for your child, communicate with teachers, and support language development at home.",
    link: "Learn More",
    href: "#",
  },
  {
    title: "Animated Podcast",
    description: "Watch Dan and Daria share real conversations about living with DLD. These short episodes help you understand your child's experience and start important conversations with them.",
    link: "YouTube",
    href: "#",
  },
  {
    title: "Educational App",
    description: "Help your child build language skills through interactive storytelling. Designed by a team of experts specifically for children with DLD. Coming soon!",
    link: "Join Waiting List",
    href: "#",
  },
];

const HowWeSupportParentsSection = () => {
  return (
    <section className="py-16 md:py-[120px]">
      <div className="container px-6 md:px-8">
        <div className="mb-10 md:mb-14">
          <h2 className="text-[30px] md:text-[46px] font-black text-foreground leading-[1.1] mb-3">
            How We Support Parents
          </h2>
          <p className="text-[14px] md:text-[16px] text-muted-foreground leading-[1.7] max-w-[650px]">
            From workshops to books to community support, we're here to help you help your child.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-lavender border border-border/30 rounded-lg p-10 flex flex-col justify-between min-h-[300px]"
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

export default HowWeSupportParentsSection;
