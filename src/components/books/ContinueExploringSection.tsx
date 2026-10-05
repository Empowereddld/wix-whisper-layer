import { Link } from "react-router-dom";
import { ArrowRight, FolderOpen, MessagesSquare, Music2, Play } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ExploreCard = {
  to: string;
  title: string;
  blurb: string;
  icon: LucideIcon;
};

const CARDS: ExploreCard[] = [
  {
    to: "/resources/podcasts",
    title: "Watch the Dan & Daria podcast",
    blurb: "Short animated episodes that make DLD easier to talk about.",
    icon: Play,
  },
  {
    to: "/music",
    title: "Listen to What Is DLD?",
    blurb: "A child-friendly song that explains DLD in a way kids remember.",
    icon: Music2,
  },
  {
    to: "/resources/downloadables",
    title: "Explore DLD resources",
    blurb: "Printable activities and guides for home, clinic, or classroom.",
    icon: FolderOpen,
  },
  {
    to: "/shop/books#parent-guide",
    title: "Learn more about talking to your child about DLD",
    blurb: "Practical prompts to help you start the conversation at home.",
    icon: MessagesSquare,
  },
];

const ContinueExploringSection = () => (
  <section className="py-12 md:py-16">
    <div className="max-w-[1100px] mx-auto px-6 md:px-10">
      <h2 className="text-[22px] md:text-[26px] font-black text-foreground mb-5 md:mb-6">
        Continue exploring DLD with Dan & Daria
      </h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {CARDS.map(({ to, title, blurb, icon: Icon }) => (
          <li key={to} className="flex">
            <Link
              to={to}
              className="group flex flex-1 flex-col rounded-xl border border-primary/10 bg-secondary/70 p-5 md:p-6 no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-secondary hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/50 bg-background text-primary">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.4} aria-hidden="true" />
                </span>
                <ArrowRight
                  className="mt-3 h-4 w-4 flex-shrink-0 text-muted-foreground/50 transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary"
                  aria-hidden="true"
                />
              </div>
              <h3 className="mt-4 text-[15px] md:text-[16px] font-bold text-foreground leading-[1.35]">
                {title}
              </h3>
              <p className="mt-1.5 text-[13px] text-muted-foreground leading-[1.6]">{blurb}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default ContinueExploringSection;
