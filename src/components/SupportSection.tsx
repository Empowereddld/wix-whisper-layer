import { ChevronRight, BookOpen, Download, Package, Mic, Users, Monitor, Briefcase, Play, ShoppingCart } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Dan & Daria Book Series",
    description: "Relatable stories showing DLD impacting kids in everyday life and kids overcoming their challenges.",
    cta: "LEARN MORE",
  },
  {
    icon: Download,
    title: "Free Downloadable Resources",
    description: "Printable guides, posters, discussion prompts, and parent resources to use immediately.",
    cta: "DOWNLOAD NOW",
  },
  {
    icon: Package,
    title: "Implementation Kits",
    description: "Tiered packages with books, lesson plans, activities, and implementation support for schools.",
    cta: "LEARN MORE",
  },
  {
    icon: Mic,
    title: "Life with DLD Podcast",
    description: "Animated, candid talk with Dan and Daria about how it feels to experience life with DLD and what helps.",
    cta: "LISTEN NOW",
  },
  {
    icon: Users,
    title: "Join Our Community",
    description: "Connect with 4,000+ families, educators, and SLPs in our supportive Facebook group.",
    cta: "JOIN TODAY",
  },
  {
    icon: Monitor,
    title: "Educational app",
    description: "Interactive stories building vocabulary, grammar, and narrative skills. Join the waitlist for beta access.",
    cta: "JOIN WAITLIST",
  },
  {
    icon: Briefcase,
    title: "Professional Development",
    description: "Workshops and speaking engagements for educators and SLPs on supporting DLD.",
    cta: "LEARN MORE",
  },
  {
    icon: Play,
    title: "Free YouTube Course",
    description: "Video lessons teaching families and educators how to support children with DLD.",
    cta: "WATCH NOW",
  },
  {
    icon: ShoppingCart,
    title: "DLD Awareness Merch",
    description: "Stuffies, bracelets, action figures, and t-shirts celebrating kids with DLD.",
    cta: "SHOP MERCH",
  },
];

const SupportSection = () => {
  return (
    <section className="py-14 md:py-18" id="about">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-8 lg:gap-14 items-start mb-12">
          <div>
            <p className="text-[14px] font-bold uppercase tracking-[0.18em] text-foreground mb-3">
              WHAT WE OFFER
            </p>
            <h2 className="text-[40px] md:text-[52px] font-black text-foreground leading-[1.1]">
              How we support children with DLD
            </h2>
          </div>
          <p className="text-muted-foreground text-[15px] leading-[1.7] lg:pt-6">
            DLD is a condition that makes communication challenging, impacting learning, friendships, and everyday communication. Our resources help kids understand how their brains work, recognize what supports work for them, while celebrating their beautiful strengths.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-background border border-border rounded-md px-6 py-7 hover:shadow-[0_5px_18px_-4px_hsl(258_50%_50%/0.09)] hover:-translate-y-[1px] transition-all duration-300 flex flex-col items-start"
            >
              <f.icon className="w-12 h-12 text-foreground stroke-[1.2] mb-5" />
              <h3 className="text-[18px] font-bold text-foreground mb-2">{f.title}</h3>
              <p className="text-[14px] text-muted-foreground leading-[1.65] mb-5 flex-1">{f.description}</p>
              <a
                href="#"
                className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.14em] text-foreground hover:text-primary transition-colors"
              >
                {f.cta}
                <ChevronRight className="!w-4 !h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
