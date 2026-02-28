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
    <section className="py-20 md:py-24 bg-muted/30" id="about">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[38%_62%] gap-10 lg:gap-16 items-start mb-12">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary mb-3">
              What We Offer
            </p>
            <h2 className="text-[26px] md:text-[32px] font-semibold text-foreground leading-[1.12]">
              How we support children with DLD
            </h2>
          </div>
          <p className="text-muted-foreground text-[15px] leading-[1.7] lg:pt-7">
            Our comprehensive approach addresses every aspect of a child's language journey — from evidence-based tools for families to professional development for educators.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-background border border-primary/[0.06] rounded-xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-lg bg-lavender flex items-center justify-center mb-4">
                <f.icon className="w-[20px] h-[20px] text-primary stroke-[1.4]" />
              </div>
              <h3 className="text-[14px] font-semibold text-foreground mb-1.5">{f.title}</h3>
              <p className="text-[13px] text-muted-foreground leading-[1.65]">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
