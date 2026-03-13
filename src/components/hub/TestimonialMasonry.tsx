import { Quote } from "lucide-react";

const testimonials = [
  {
    role: "Parent of a child with DLD",
    quote: "For the first time, my child saw a character who felt like them. Dan struggles with words the same way my son does. It opened the door for conversations we had never been able to have before.",
    variant: "white" as const,
  },
  {
    role: "Speech Language Pathologist",
    quote: "These books make it easier to explain DLD to children and families. The stories capture the real challenges kids face while also showing their strengths. I have started recommending them to every family I work with.",
    variant: "lavender" as const,
  },
  {
    role: "Elementary teacher",
    quote: "My students immediately connected with Dan and Daria. The stories helped our class talk about communication differences and how we can support each other.",
    variant: "white" as const,
  },
  {
    role: "Parent in the Facebook community",
    quote: "Finding this community changed everything for our family. Before joining, we felt completely alone. Now we have resources, strategies, and a group of people who truly understand what living with DLD looks like.",
    variant: "lavender" as const,
  },
  {
    role: "SLP using the podcast",
    quote: "The Dan and Daria podcast is a fantastic therapy tool. The episodes create natural opportunities to talk about self advocacy, problem solving, and social situations in a way that feels safe and relatable for kids.",
    variant: "neutral" as const,
  },
  {
    role: "Special education teacher",
    quote: "The books are incredibly useful for building empathy in the classroom. Students begin to understand that communication challenges are not about intelligence, but about how the brain processes language.",
    variant: "lavender" as const,
  },
  {
    role: "Parent using the books at home",
    quote: "We read Dan and the Paper Airplane together and my daughter said, 'That's exactly how my brain feels.' I had never heard her describe her experience that clearly before.",
    variant: "neutral" as const,
  },
  {
    role: "Therapist working with children with DLD",
    quote: "There are very few resources that explain developmental language disorder in a way children can understand. This series fills a huge gap in awareness and support.",
    variant: "white" as const,
  },
  {
    role: "Member of the DLD Community",
    quote: "Empowered DLD Parenting is helping change how people understand developmental language disorder. The combination of stories, practical tools, and community support is something families have been needing for a long time.",
    variant: "neutral" as const,
  },
];

const variantClasses = {
  white: "bg-card border-border",
  lavender: "bg-[hsl(264_50%_97%)] border-[hsl(264_40%_92%)]",
  neutral: "bg-[hsl(240_10%_97%)] border-[hsl(240_8%_92%)]",
};

/* Split testimonials into 3 columns for masonry effect */
const getColumns = (items: typeof testimonials) => {
  const cols: (typeof testimonials)[] = [[], [], []];
  items.forEach((item, i) => cols[i % 3].push(item));
  return cols;
};

const TestimonialMasonry = () => {
  const columns = getColumns(testimonials);

  return (
    <section className="py-16 lg:py-20 bg-background">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-4">
          <h2 className="text-[28px] md:text-[36px] font-black text-foreground leading-[1.1]">
            What Families, Educators, and Therapists Are Saying
          </h2>
        </div>
        <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.7] max-w-[640px] mx-auto text-center mb-12">
          Real feedback from parents, educators, therapists, and community members using our books, podcast, and DLD resources.
        </p>

        {/* Masonry grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`break-inside-avoid rounded-2xl border p-6 md:p-7 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-12px_hsl(262_40%_40%/0.12)] ${variantClasses[t.variant]}`}
            >
              <p className="text-[11px] md:text-[12px] font-semibold uppercase tracking-[0.14em] text-primary/70 mb-3">
                {t.role}
              </p>
              <Quote className="h-5 w-5 text-primary/20 mb-2 flex-shrink-0" />
              <p className="text-[14px] md:text-[15px] text-foreground/80 leading-[1.75]">
                {t.quote}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialMasonry;
