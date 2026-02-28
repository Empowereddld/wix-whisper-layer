import {
  BookOpen, MessageCircle, Users, Brain, Puzzle, Star, HandHeart, Target, Lightbulb,
} from "lucide-react";

const features = [
  { icon: BookOpen, title: "Evidence-Based Resources", description: "Curated materials grounded in the latest DLD research and clinical best practices." },
  { icon: MessageCircle, title: "Communication Strategies", description: "Practical techniques to support language development in everyday interactions." },
  { icon: Users, title: "Community Support", description: "Connect with other families, educators, and professionals navigating DLD together." },
  { icon: Brain, title: "Understanding DLD", description: "Clear, accessible information about what DLD is and how it impacts children." },
  { icon: Puzzle, title: "Classroom Tools", description: "Ready-to-use accommodations and strategies for inclusive learning environments." },
  { icon: Star, title: "Celebrating Strengths", description: "Resources that focus on what children with DLD can do, not just their challenges." },
  { icon: HandHeart, title: "Emotional Wellbeing", description: "Supporting the social-emotional needs of children with language difficulties." },
  { icon: Target, title: "Goal Setting", description: "Tools for setting meaningful, achievable language and communication goals." },
  { icon: Lightbulb, title: "Professional Development", description: "Training and workshops for educators and therapists working with DLD." },
];

const SupportSection = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30" id="about">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            How We Support Children with DLD
          </h2>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto">
            Our comprehensive approach addresses every aspect of a child's language journey.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-background border border-[#e5e5e5] rounded-[10px] p-[22px]"
            >
              <f.icon className="w-9 h-9 text-primary mb-3 stroke-[1.5]" />
              <h3 className="font-sans text-base font-semibold text-foreground mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
