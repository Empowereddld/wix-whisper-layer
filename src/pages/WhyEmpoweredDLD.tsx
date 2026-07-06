import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import ContactSection from "@/components/ContactSection";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, GraduationCap } from "lucide-react";
import foundersPhoto from "@/assets/founders-circle.webp";

const differentiators = [
  {
    title: "Story-led and evidence-informed",
    body:
      "We build understanding through stories children connect with, grounded in what speech-language pathologists and educators know works.",
  },
  {
    title: "Practical tools for home, therapy, and the classroom",
    body:
      "Every resource is designed so parents, educators, and speech-language pathologists (SLPs) know what to do next, not just what DLD is.",
  },
  {
    title: "Children-first, lifespan-aware",
    body:
      "Our work begins with children so they feel seen early, while recognizing that DLD is lifelong and adults with DLD deserve support too.",
  },
];

const linkCards = [
  {
    title: "Books",
    body: "Picture books written for children with DLD and the adults who read alongside them.",
    to: "/shop/books",
    Icon: BookOpen,
    cta: "Shop books",
  },
  {
    title: "Resource Library",
    body: "Downloadables, tools, and community for parents, educators, and SLPs.",
    to: "/hub",
    Icon: Sparkles,
    cta: "Explore the Resource Library",
  },
  {
    title: "Work With Us",
    body: "Training, speaking, and partnership for schools, clinics, and organizations.",
    to: "/work-with-us",
    Icon: GraduationCap,
    cta: "See how we partner",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "Why Empowered DLD",
  description:
    "Empowered DLD is a story-led, practical support system for children with Developmental Language Disorder and the parents, educators, and speech-language pathologists (SLPs) who support them.",
  url: "https://www.empowereddld.com/why-empowered-dld",
};

const WhyEmpoweredDLD = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Why Empowered DLD | Support for Children with DLD"
        description="Empowered DLD is a story-led, practical support system for children with Developmental Language Disorder and the parents, educators, and speech-language pathologists (SLPs) who support them."
        path="/why-empowered-dld"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Why Empowered DLD", path: "/why-empowered-dld" },
        ]}
        jsonLd={jsonLd}
      />
      <Header />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[hsl(270_55%_98%)] via-[hsl(264_48%_96%)] to-[hsl(258_42%_94%)]">
          <div className="container px-6 md:px-8 py-20 md:py-28 lg:py-32 max-w-[1100px]">
            <p className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.18em] text-primary mb-4">
              WHY EMPOWERED DLD
            </p>
            <h1 className="text-[38px] sm:text-[46px] md:text-[56px] lg:text-[64px] leading-[1.05] font-black text-foreground mb-6 tracking-[-0.025em] max-w-[900px]">
              Practical support for children with DLD and the adults around them.
            </h1>
            <p className="text-[16px] md:text-[18px] leading-[1.65] text-foreground/75 max-w-[680px]">
              Empowered DLD creates story-led books, resources, and training for children with Developmental Language Disorder (DLD) and the parents, educators, and speech-language pathologists who support them.
            </p>
          </div>
        </section>

        {/* What we are */}
        <section className="py-16 md:py-20 lg:py-24">
          <div className="container px-6 md:px-8 max-w-[900px]">
            <p className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.22em] text-foreground/50 mb-3">
              WHAT WE ARE
            </p>
            <h2 className="text-[28px] md:text-[36px] lg:text-[42px] font-black text-foreground leading-[1.1] mb-6">
              A story-led support system, not another awareness page
            </h2>
            <div className="space-y-5 text-[15px] md:text-[16px] text-muted-foreground leading-[1.75]">
              <p>
                Empowered DLD brings together children's books, downloadable resources, animated podcast episodes, a free video course, community, and professional training, with upcoming music, so children with DLD understand how their brains work and the adults around them have practical tools for home, therapy, and the classroom.
              </p>
              <p>
                We built this because families and professionals kept saying the same thing. They understood that DLD existed. What they wanted was to know what to do next.
              </p>
              <p>
                Everything we make is designed to answer that question in a way a parent can use on a Tuesday night, an SLP can bring into a session, and a teacher can try in a classroom on Monday morning.
              </p>
            </div>
          </div>
        </section>

        {/* How we're different */}
        <section className="py-16 md:py-20 lg:py-24 bg-[hsl(270_45%_97%)]">
          <div className="container px-6 md:px-8 max-w-[1100px]">
            <div className="text-center mb-12 md:mb-14">
              <p className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.22em] text-foreground/50 mb-3">
                HOW WE'RE DIFFERENT
              </p>
              <h2 className="text-[28px] md:text-[36px] lg:text-[42px] font-black text-foreground leading-[1.1] mb-5 max-w-[780px] mx-auto">
                Awareness matters. So does knowing what to do on Monday morning.
              </h2>
              <p className="text-[15px] md:text-[16px] text-muted-foreground leading-[1.7] max-w-[640px] mx-auto">
                We deeply value the awareness work happening across the DLD community. Empowered DLD exists to help families and professionals take the next practical step.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {differentiators.map((d) => (
                <div
                  key={d.title}
                  className="bg-background rounded-2xl p-7 md:p-8 shadow-[0_2px_10px_hsl(258_20%_40%/0.06)] border border-foreground/5"
                >
                  <h3 className="text-[18px] md:text-[20px] font-black text-foreground leading-[1.25] mb-3">
                    {d.title}
                  </h3>
                  <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.7]">
                    {d.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Founders */}
        <section className="py-16 md:py-20 lg:py-24">
          <div className="container px-6 md:px-8 max-w-[1100px]">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-14 items-start">
              <div className="flex justify-center lg:justify-start">
                <img
                  src={foundersPhoto}
                  alt="Jinean Whitley and Camesha Russell, co-founders of Empowered DLD"
                  className="w-full max-w-[360px] h-auto rounded-2xl object-cover"
                  loading="lazy"
                />
              </div>
              <div>
                <p className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.22em] text-foreground/50 mb-3">
                  WHO BUILT THIS
                </p>
                <h2 className="text-[28px] md:text-[36px] lg:text-[42px] font-black text-foreground leading-[1.1] mb-6">
                  Built by an SLP and an elementary educator
                </h2>

                <div className="mb-6">
                  <h3 className="text-[17px] md:text-[19px] font-bold text-foreground mb-2">
                    Jinean Whitley, Speech-Language Pathologist
                  </h3>
                  <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.75]">
                    Jinean brings clinical expertise in child language, DLD, literacy, parent education, and school-based advocacy. She also has a family connection to DLD, which keeps this work close to home.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-[17px] md:text-[19px] font-bold text-foreground mb-2">
                    Camesha Russell, elementary educator
                  </h3>
                  <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.75]">
                    Camesha brings classroom experience, child development knowledge, literacy instruction, and a deep understanding of what support actually needs to look like in real classrooms.
                  </p>
                </div>

                <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.75] pl-3 border-l-2 border-primary/30">
                  Our work begins with children while recognizing that DLD is lifelong.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What we make */}
        <section className="py-16 md:py-20 lg:py-24 bg-[hsl(270_45%_97%)]">
          <div className="container px-6 md:px-8 max-w-[1100px]">
            <div className="text-center mb-12">
              <p className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.22em] text-foreground/50 mb-3">
                WHAT WE MAKE
              </p>
              <h2 className="text-[28px] md:text-[36px] lg:text-[42px] font-black text-foreground leading-[1.1] max-w-[680px] mx-auto">
                Three ways to bring Empowered DLD into your day
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {linkCards.map(({ title, body, to, Icon, cta }) => (
                <Link
                  key={title}
                  to={to}
                  className="group flex flex-col bg-background rounded-2xl p-7 md:p-8 shadow-[0_2px_10px_hsl(258_20%_40%/0.06)] border border-foreground/5 hover:shadow-[0_6px_20px_hsl(258_30%_40%/0.1)] transition-shadow duration-300"
                >
                  <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-primary" strokeWidth={1.6} />
                  </div>
                  <h3 className="text-[19px] md:text-[21px] font-black text-foreground leading-[1.2] mb-3">
                    {title}
                  </h3>
                  <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.7] mb-5 flex-1">
                    {body}
                  </p>
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary group-hover:underline">
                    {cta} →
                  </span>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/who-we-serve">
                <Button className="h-[50px] px-8 rounded-md bg-deep-purple text-deep-purple-foreground hover:bg-deep-purple/90 text-[11px] font-bold uppercase tracking-[0.14em] shadow-[0_2px_8px_hsl(258_50%_50%/0.2)] hover:shadow-[0_4px_14px_hsl(258_50%_50%/0.25)] hover:brightness-[0.96] transition-all duration-300">
                  Find what works for you
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <ContactSection />
      </main>

      <Footer />
    </div>
  );
};

export default WhyEmpoweredDLD;
