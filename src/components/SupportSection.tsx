import {
  BookOpen, MessageCircle, Users, Brain, Puzzle, Star, HandHeart, Target, Lightbulb,
} from "lucide-react";

const features = [
  { icon: BookOpen, title: "Core Evidence Series", description: "Curated materials grounded in the latest DLD research and clinical best practices." },
  { icon: MessageCircle, title: "Free Downloadable Resources", description: "Practical techniques to support language development in everyday interactions." },
  { icon: Users, title: "Documentation Kits", description: "Connect with other families, educators, and professionals navigating DLD together." },
  { icon: Brain, title: "Education DLD Guides", description: "Clear, accessible information about what DLD is and how it impacts children." },
  { icon: Puzzle, title: "Family Documents", description: "Ready-to-use accommodations and strategies for inclusive learning environments." },
  { icon: Star, title: "Infographics", description: "Resources that focus on what children with DLD can do, not just their challenges." },
  { icon: HandHeart, title: "Professional Development", description: "Supporting the social-emotional needs of children with language difficulties." },
  { icon: Target, title: "New Product Launches", description: "Tools for setting meaningful, achievable language and communication goals." },
  { icon: Lightbulb, title: "All Resources for Miners", description: "Training and workshops for educators and therapists working with DLD." },
];

const SupportSection = () => {
  return (
    <section className="py-20 md:py-28 bg-muted/30" id="about">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-12 lg:gap-16 items-start mb-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-3">
              What We Offer
            </p>
            <h2 className="text-[28px] md:text-[34px] font-semibold text-foreground leading-tight">
              How we support children with DLD
            </h2>
          </div>
          <p className="text-muted-foreground text-base leading-[1.7] lg:pt-8">
            Our comprehensive approach addresses every aspect of a child's language journey — from evidence-based tools for families to professional development for educators.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-background border border-border/20 rounded-xl p-7 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-lg bg-lavender flex items-center justify-center mb-5">
                <f.icon className="w-6 h-6 text-primary stroke-[1.5]" />
              </div>
              <h3 className="font-sans text-[15px] font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-[1.7]">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
