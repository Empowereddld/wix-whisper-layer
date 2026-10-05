import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const LINKS = [
  { to: "/resources/podcasts", label: "Watch the Dan & Daria podcast" },
  { to: "/music", label: "Listen to What Is DLD?" },
  { to: "/resources/downloadables", label: "Explore DLD resources" },
  { to: "/shop/books#parent-guide", label: "Learn more about talking to your child about DLD" },
];

const ContinueExploringSection = () => (
  <section className="pb-12 md:pb-16">
    <div className="max-w-[1100px] mx-auto px-6 md:px-10">
      <h2 className="text-[22px] md:text-[26px] font-black text-foreground mb-5">
        Continue exploring DLD with Dan & Daria
      </h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {LINKS.map((l) => (
          <li key={l.to}>
            <Link
              to={l.to}
              className="flex items-center justify-between gap-3 min-h-[52px] px-5 py-3 rounded-lg border border-border bg-muted/50 text-[14px] md:text-[15px] font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              {l.label}
              <ArrowRight className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default ContinueExploringSection;
