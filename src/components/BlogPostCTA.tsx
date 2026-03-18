import { Link } from "react-router-dom";
import { BookOpen, GraduationCap, Rocket, FolderOpen, Play } from "lucide-react";

interface BlogPostCTAProps {
  categories?: string[] | null;
}

const PODCAST_CTA = {
  title: "Watch the Dan & Daria Podcast",
  description: "See Dan and Daria share real stories about life with DLD",
  href: "https://youtube.com/playlist?list=PLzfiOYFA1If6abH3LUNdxKPOAuOgkjZN5&si=92E3bFbq89Y3B_F_",
  label: "Watch Now",
  icon: Play,
  external: true,
};

const SECONDARY_CTAS = [
  {
    id: "books",
    title: "Explore Our Books",
    description: "Stories that help kids with DLD feel seen and understood",
    href: "/books",
    label: "See the Books",
    icon: BookOpen,
    categories: ["Kids", "Parenting", "Awareness"],
  },
  {
    id: "course",
    title: "Take the Free Course",
    description: "Learn strategies to support your child with DLD",
    href: "/resources/free-course",
    label: "Start Learning",
    icon: GraduationCap,
    categories: ["DLD", "Parenting", "Academics"],
  },
  {
    id: "resources",
    title: "Browse Resources",
    description: "Downloadable tools for parents, therapists, and educators",
    href: "/resources",
    label: "Explore Resources",
    icon: FolderOpen,
    categories: ["Skills", "Academics"],
  },
  {
    id: "waitlist",
    title: "Join the Waitlist",
    description: "Get early access to our app — tools built for families navigating DLD",
    href: "/storybuilders",
    label: "Join Now",
    icon: Rocket,
    categories: [],
  },
];

function getSecondaryCTA(categories?: string[] | null) {
  if (categories && categories.length > 0) {
    for (const cta of SECONDARY_CTAS) {
      if (cta.categories.length > 0 && cta.categories.some((c) => categories.includes(c))) {
        return cta;
      }
    }
  }
  // Fallback to waitlist
  return SECONDARY_CTAS[SECONDARY_CTAS.length - 1];
}

const BlogPostCTA = ({ categories }: BlogPostCTAProps) => {
  const secondary = getSecondaryCTA(categories);

  return (
    <section className="mt-14 pt-10 border-t border-border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Podcast CTA */}
        <a
          href={PODCAST_CTA.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col rounded-xl bg-deep-purple p-6 md:p-7 transition-all duration-300 hover:shadow-elevated"
        >
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <PODCAST_CTA.icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-bold text-deep-purple-foreground leading-tight pt-1.5">
              {PODCAST_CTA.title}
            </h3>
          </div>
          <p className="text-deep-purple-foreground/75 text-sm mb-5 leading-relaxed">
            {PODCAST_CTA.description}
          </p>
          <span className="mt-auto self-start inline-flex items-center gap-1.5 text-sm font-semibold text-primary-foreground bg-primary/30 px-4 py-2 rounded-full group-hover:bg-primary/50 transition-colors">
            {PODCAST_CTA.label} →
          </span>
        </a>

        {/* Secondary CTA */}
        <Link
          to={secondary.href}
          className="group flex flex-col rounded-xl bg-secondary border border-border p-6 md:p-7 transition-all duration-300 hover:shadow-elevated"
        >
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <secondary.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground leading-tight pt-1.5">
              {secondary.title}
            </h3>
          </div>
          <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
            {secondary.description}
          </p>
          <span className="mt-auto self-start inline-flex items-center gap-1.5 text-sm font-semibold text-primary-foreground bg-primary px-4 py-2 rounded-full group-hover:bg-primary/90 transition-colors">
            {secondary.label} →
          </span>
        </Link>
      </div>
    </section>
  );
};

export default BlogPostCTA;
