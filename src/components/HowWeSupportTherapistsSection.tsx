import { ChevronRight } from "lucide-react";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";

const cards = [
  {
    title: "Books & Therapy Guides",
    description: "Children's books featuring diverse characters with DLD, with ready-made therapy guides. Use in sessions or recommend to families. Available in 7+ languages.",
    link: "Buy Now",
    href: "/shop/books",
  },
  {
    title: "Parent Resources",
    description: "Give families practical strategies that bridge clinic and home practice. Includes activities, conversation starters, and confidence-building tools families can use independently.",
    link: "Browse Resources",
    href: "/hub/preview",
  },
  {
    title: "Workshops & Training",
    description: "Evidence-based DLD training for your team. Topics include recognizing DLD in underserved populations and multilingual considerations. Perfect for in-service training.",
    link: "Learn More",
    href: "/contact",
  },
  {
    title: "Animated Podcast",
    description: "Short animated episodes showing what it's like to live with DLD. Use the clips in therapy sessions to facilitate discussion and recommend to families for home viewing.",
    link: "Watch on YouTube",
    href: "https://youtube.com/playlist?list=PLzfiOYFA1If6abH3LUNdxKPOAuOgkjZN5",
  },
  {
    title: "Educational App",
    description: "Evidence-based language app for therapy and home practice. Interactive storytelling specifically designed for children with DLD. Assign it between sessions. Coming soon!",
    link: "Join Waiting List",
    href: "/contact",
  },
  {
    title: "Stock Your Therapy Room",
    description: "Resource bundles for schools and clinics. Get multiple copies of books, guides, and tools at discounted rates to serve your entire caseload with diverse, multilingual materials.",
    link: "Buy Now",
    href: "/shop/bulk-orders",
  },
];

const CardItem = ({ card, index }: { card: typeof cards[0]; index: number }) => {
  const cardFade = useScrollFadeIn({ delay: index * 80 });
  return (
    <div
      ref={cardFade.ref}
      className={`group bg-lavender border border-border/30 rounded-lg p-6 md:p-8 lg:p-10 flex flex-col min-h-[220px] md:min-h-[260px] transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${cardFade.className}`}
    >
      <div>
        <h3 className="text-[20px] md:text-[24px] font-black text-foreground mb-4 text-center max-w-[180px] mx-auto min-h-[56px] md:min-h-[64px]">
          {card.title}
        </h3>
        <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.7]">
          {card.description}
        </p>
      </div>
      <a
        href={card.href}
        {...(card.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="inline-flex items-center gap-1 text-[11px] md:text-[12px] font-bold uppercase tracking-[0.12em] text-foreground hover:text-primary transition-colors mt-auto pt-6"
      >
        {card.link}
        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </a>
    </div>
  );
};

const HowWeSupportTherapistsSection = () => {
  const headingFade = useScrollFadeIn();

  return (
    <section className="py-10 md:py-16 lg:py-[120px]">
      <div className="container px-6 md:px-8">
        <div ref={headingFade.ref} className={`mb-8 md:mb-10 lg:mb-14 ${headingFade.className}`}>
          <h2 className="text-[28px] md:text-[38px] lg:text-[46px] font-black text-foreground leading-[1.1] mb-3">
            How We Support Therapists
          </h2>
          <p className="text-[13px] md:text-[14px] lg:text-[16px] text-muted-foreground leading-[1.7] max-w-[650px]">
            Ready-to-use materials that save you time and better serve your clients.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8">
          {cards.map((card, i) => (
            <CardItem key={card.title} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowWeSupportTherapistsSection;
