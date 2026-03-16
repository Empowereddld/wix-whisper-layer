import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, ArrowRight, FileText, Image, BookOpen, Package, BarChart3, Check } from "lucide-react";
import hallwayBg from "@/assets/school-hallway-bg.webp";
import graphicOrganizersPreview from "@/assets/resource-graphic-organizers-preview.png";
import checklistPreview from "@/assets/resource-checklist-preview.png";
import emailTemplatesPreview from "@/assets/resource-email-templates-preview.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TestimonialMasonry from "@/components/hub/TestimonialMasonry";

/* ── Data ── */

const typeIcons: Record<string, React.ElementType> = {
  poster: Image,
  guide: BookOpen,
  checklist: FileText,
  bundle: Package,
  infographic: BarChart3,
  activity: Check,
};

const placeholderResources = [
  { id: "1", title: "Language Impact Checklist", description: "A structured checklist to help educators and therapists identify how language difficulties are affecting a student's learning and participation at school.", type: "checklist", audiences: ["Educators", "Therapists"], image: checklistPreview },
  { id: "2", title: "Dan and Daria's Graphic Organizers", description: "A practical toolkit to help children with DLD visualize their thinking and express ideas more clearly — covering 10 key academic language skills.", type: "activity", audiences: ["Parents", "Educators", "Therapists"], image: graphicOrganizersPreview },
  { id: "3", title: "Parent Email Templates", description: "Ready-to-use email templates to help parents start confident, supportive conversations with their child's teacher and school team.", type: "guide", audiences: ["Parents"], image: emailTemplatesPreview },
];

const testimonials = [
  { quote: "These resources have completely changed how I explain DLD to parents in my practice.", name: "Sarah M.", role: "Therapist, UK" },
  { quote: "As a mum of a child with DLD, finding this community was a turning point for our family.", name: "Priya T.", role: "Parent, Australia" },
  { quote: "The classroom guides are practical, inclusive, and my students actually respond to them.", name: "Marcus L.", role: "Educator, Canada" },
];

const faqs = [
  { q: "Is the Resource Hub free to join?", a: "Yes, completely free. We created it so families, educators, and therapists can easily find practical tools for supporting children with Developmental Language Disorder (DLD)." },
  { q: "Who is the Resource Hub designed for?", a: "Anyone supporting a child with DLD, including parents, educators, speech-language pathologists, and other professionals. If a child with DLD is in your life, this space is for you." },
  { q: "What kinds of resources are included in the Resource Hub?", a: "Printable guides, checklists, activity ideas, and discussion tools, all designed to help children with DLD build communication skills, understand themselves, and feel more confident." },
  { q: "How do I access resources after signing up?", a: "Create your free account and you'll have immediate access to the Resource Library. New materials are added regularly, so it's always worth coming back." },
  { q: "Can I share resources with colleagues or other parents?", a: "Please do. Sharing helps more families and communities understand DLD, and that's exactly the point." },
  { q: "What is Developmental Language Disorder (DLD)?", a: "Developmental Language Disorder is a difference in how the brain learns and uses language. Children with DLD may have difficulty understanding language, expressing their ideas, or learning new words and grammar. DLD is common, affecting about 1 in 14 children, yet many families and educators have never heard the term. With the right understanding and support, children with DLD can thrive." },
];

const interestOptions = [
  "Understanding DLD",
  "Classroom strategies and accommodations",
  "Activities to support language development",
  "Therapy tools and intervention ideas",
  "Resources to share with schools or professionals",
  "Social communication and friendship support",
  "I'm exploring and not sure where to start",
];



/* ── Animated Counter ── */
const AnimatedCounter = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1600;
          const start = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

/* ── Page ── */
const HubPreview = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) newErrors.email = "Please enter a valid email.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    navigate("/hub/signup");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* ── Section 1: Hero ── */}
      <section className="relative overflow-hidden py-20 md:py-28 lg:py-32">
        {/* Layer 1: Blurred school hallway background */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-[2px] scale-105"
          style={{ backgroundImage: `url(${hallwayBg})` }}
        />
        {/* Layer 2: White-lavender overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(270_55%_98%/0.78)] via-[hsl(264_48%_96%/0.72)] via-[60%] to-[hsl(258_42%_94%/0.66)]" />
        {/* Layer 3: Content */}
        <div className="relative z-10 container px-6 md:px-8 flex flex-col items-center text-center gap-6">
          <p className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.22em] text-primary/85">
            DLD RESOURCE HUB
          </p>
          <h1 className="text-[32px] md:text-[48px] lg:text-[56px] font-black text-foreground leading-[1.1] max-w-[800px]">
            Everything You Need to Support a Child with DLD
          </h1>
          <p className="text-[14px] md:text-[16px] text-foreground/55 leading-[1.7] max-w-[620px]">
            Printable guides, checklists, and learning tools to support children with Developmental Language Disorder.
          </p>
          <p className="text-[13px] md:text-[14px] text-foreground/40">
            Join 4,300+ parents, therapists, and educators in the Developmental Language Disorder community.
          </p>
          <Link to="/hub/signup">
            <Button size="lg" className="bg-deep-purple text-deep-purple-foreground hover:bg-deep-purple/90 h-14 px-8 text-[15px] font-bold tracking-wide mt-2 shadow-[0_1px_3px_hsl(262_49%_30%/0.12)] hover:shadow-[0_2px_6px_hsl(262_49%_30%/0.16)] transition-all duration-300">
              Get Instant Access <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-[13px] text-foreground/35">
            Create a free account to explore the Resource Hub.
          </p>
        </div>
      </section>

      {/* ── Section 2: Signup Form ── */}
      <section className="bg-muted py-16 lg:py-20">
        <div className="max-w-[540px] mx-auto px-4 sm:px-6">
          <div className="bg-card rounded-xl border border-border shadow-[var(--shadow-elevated)] p-8 md:p-10">
            <h2 className="text-[22px] md:text-[26px] font-black text-foreground leading-[1.2] mb-2 text-center">
              Create your free account
            </h2>
            <p className="text-[14px] text-muted-foreground leading-[1.7] mb-8 text-center">
              Access practical resources designed to support children with Developmental Language Disorder.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div>
                <Label htmlFor="signup-name" className="text-foreground font-medium text-[13px]">Name <span className="text-destructive">*</span></Label>
                <Input id="signup-name" placeholder="Your name" className="mt-1.5" value={name} onChange={(e) => setName(e.target.value)} />
                {errors.name && <p className="text-destructive text-[12px] mt-1">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="signup-email" className="text-foreground font-medium text-[13px]">Email <span className="text-destructive">*</span></Label>
                <Input id="signup-email" type="email" placeholder="you@example.com" className="mt-1.5" value={email} onChange={(e) => setEmail(e.target.value)} />
                {errors.email && <p className="text-destructive text-[12px] mt-1">{errors.email}</p>}
              </div>
              <Button type="submit" className="w-full h-12 bg-deep-purple text-white hover:bg-deep-purple/90 font-bold text-[14px] tracking-wide">
                Get Instant Access <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <p className="text-[12px] text-muted-foreground text-center">
                Free account. Instant access.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* ── Section 3: Community Stats ── */}
      <section className="bg-deep-purple py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-5 md:px-10 text-center">
          <h2 className="text-[18px] md:text-[20px] lg:text-[22px] font-semibold text-white leading-[1.4] mb-12 max-w-[900px] mx-auto">
            Empowering families and professionals around the world<br className="hidden md:block" /> to better understand Developmental Language Disorder.
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0 max-w-[900px] mx-auto mb-10">
            <div className="flex flex-col items-center md:border-r md:border-white/20 md:pr-12">
              <span className="text-[48px] md:text-[64px] lg:text-[72px] font-bold text-white leading-none">
                <AnimatedCounter target={4300} suffix="+" />
              </span>
              <span className="text-white/60 text-[15px] md:text-[16px] mt-2 font-medium">Global community members</span>
            </div>
            <div className="flex flex-col items-center md:pl-12">
              <span className="text-[48px] md:text-[64px] lg:text-[72px] font-bold text-white leading-none">
                <AnimatedCounter target={15} suffix="+" />
              </span>
              <span className="text-white/60 text-[15px] md:text-[16px] mt-2 font-medium">Countries reached worldwide</span>
            </div>
          </div>
          
          <p className="text-[13px] md:text-[14px] text-white/50 font-normal">
            Advancing DLD awareness while supporting families and professionals worldwide.
          </p>
        </div>
      </section>

      {/* ── Section 4: Resource Preview ── */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-[28px] md:text-[36px] font-black text-foreground leading-[1.1] mb-3">
              A Few of the Tools Inside the Resource Hub
            </h2>
            <p className="text-[14px] md:text-[16px] text-muted-foreground leading-[1.7] max-w-[620px] mx-auto">
              Create your free account to access the full library of printable guides, checklists, and practical supports for children with Developmental Language Disorder.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {placeholderResources.map((resource) => {
              const Icon = typeIcons[resource.type] || FileText;
              return (
                <div key={resource.id} className="relative bg-card rounded-xl border border-border overflow-hidden group shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow">
                  <div className="h-52 bg-muted flex items-center justify-center overflow-hidden">
                    {resource.image ? (
                      <img src={resource.image} alt={resource.title} className="w-full h-full object-cover" />
                    ) : (
                      <Icon className="h-12 w-12 text-muted-foreground/40" />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-[15px] text-foreground mb-2 line-clamp-2 leading-snug">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{resource.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {resource.audiences.map((audience) => (
                        <span key={audience} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{audience}</span>
                      ))}
                      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium capitalize">{resource.type === "activity" ? "Activity Pack" : resource.type}</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-deep-purple/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
                    <Lock className="h-8 w-8 text-white/80" />
                    <p className="text-white font-medium text-sm">Sign Up to Access</p>
                    <Link to="/hub/signup">
                      <Button size="sm" className="bg-white text-deep-purple hover:bg-white/90 font-bold">Create Free Account</Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Section 5: Testimonials ── */}
      <TestimonialMasonry />

      {/* ── Section 6: FAQ ── */}
      <section className="py-16 lg:py-20 bg-muted">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-[28px] md:text-[36px] font-black text-foreground text-center mb-10 leading-[1.1]">
            Common Questions
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-card rounded-xl border border-border px-6 shadow-[var(--shadow-card)] data-[state=open]:shadow-[var(--shadow-card-hover)] transition-shadow"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5 text-base">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5 text-[15px]">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── Section 7: Final CTA ── */}
      <section className="bg-black py-20 md:py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-[28px] md:text-[36px] lg:text-[42px] font-black text-white leading-[1.1] mb-4">
            Start exploring the DLD Resource Hub
          </h2>
          <p className="text-[14px] md:text-[16px] text-white/70 leading-[1.7] mb-8 max-w-[620px] mx-auto">
            Create your free account and discover tools for supporting children with Developmental Language Disorder.
          </p>
          <Link to="/hub/signup">
            <Button size="lg" className="bg-white text-deep-purple hover:bg-white/90 h-14 px-8 text-[15px] font-bold tracking-wide">
              Get Instant Access <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HubPreview;
