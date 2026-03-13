import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, ArrowRight, FileText, Image, BookOpen, Package, BarChart3, Quote, Check } from "lucide-react";
import hallwayBg from "@/assets/school-hallway-bg.webp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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
};

const placeholderResources = [
  { id: "1", title: "Dan and Daria's Tips for Little Talkers", description: "A colorful poster with practical tips to support early language development at home.", type: "poster", audience: "Parents" },
  { id: "2", title: "DLD Awareness Infographic", description: "A visual guide explaining DLD signs, statistics, and intervention strategies.", type: "infographic", audience: "Therapists" },
  { id: "3", title: "Accommodations & Modifications for DLD", description: "A comprehensive checklist of classroom accommodations to support students with DLD.", type: "checklist", audience: "Educators" },
  { id: "4", title: "Language Impact Checklist", description: "An assessment tool to identify how DLD affects communication across different settings.", type: "checklist", audience: "Therapists" },
  { id: "5", title: "DLD Discussion & Activity Guide", description: "Engaging activities and discussion prompts for teaching students about DLD.", type: "guide", audience: "Educators" },
  { id: "6", title: "DLD Starter Pack", description: "A curated bundle of essential resources for families new to the DLD journey.", type: "bundle", audience: "Parents" },
];

const testimonials = [
  { quote: "These resources have completely changed how I explain DLD to parents in my practice.", name: "Sarah M.", role: "Therapist, UK" },
  { quote: "As a mum of a child with DLD, finding this community was a turning point for our family.", name: "Priya T.", role: "Parent, Australia" },
  { quote: "The classroom guides are practical, inclusive, and my students actually respond to them.", name: "Marcus L.", role: "Educator, Canada" },
];

const faqs = [
  { q: "Is the Resource Hub free to join?", a: "Yes, creating an account is completely free. Some resources are free to download, and others may be available for purchase. No credit card is required to sign up." },
  { q: "Do I need to be a professional to sign up?", a: "Not at all. The hub is designed for parents, therapists, and educators alike — anyone supporting a child with DLD." },
  { q: "What kinds of resources are included?", a: "Posters, checklists, activity guides, infographics, and bundles — all created specifically for children with Developmental Language Disorder." },
  { q: "How often are new resources added?", a: "We add new resources regularly. Every time you log in, check the \"New This Month\" section for the latest additions." },
  { q: "Can I share resources with colleagues or other parents?", a: "Yes! Each resource has a share button so you can spread the word and help more families find support." },
];

const interestOptions = [
  "Understanding DLD",
  "Classroom strategies and accommodations",
  "Activities to support language development",
  "Therapy tools and intervention ideas",
  "Resources to share with schools or professionals",
  "Social communication and friendship support",
  "I'm just exploring",
];

type AudienceFilter = "All" | "Parents" | "Therapists" | "Educators";

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
  const [activeFilter, setActiveFilter] = useState<AudienceFilter>("All");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [otherRole, setOtherRole] = useState("");
  const [customInterest, setCustomInterest] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const filteredResources = placeholderResources.filter(
    (resource) => activeFilter === "All" || resource.audience === activeFilter
  );

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) newErrors.email = "Please enter a valid email.";
    if (!selectedRole) newErrors.role = "Please select a role.";
    if (selectedRole === "other" && !otherRole.trim()) newErrors.otherRole = "Please specify your role.";
    if (selectedInterests.length === 0) newErrors.interests = "Please select at least one interest.";

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
            DLD Resources for Families and Professionals
          </h1>
          <p className="text-[14px] md:text-[16px] text-foreground/55 leading-[1.7] max-w-[620px]">
            Posters, guides, checklists, and learning tools supporting children with Developmental Language Disorder.
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
              Create your free account to explore the DLD Resource Hub
            </h2>
            <p className="text-[14px] text-muted-foreground leading-[1.7] mb-8 text-center">
              Access practical resources designed to support children with Developmental Language Disorder at home, in therapy, and in the classroom.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div>
                <Label htmlFor="signup-name" className="text-foreground font-medium text-[13px]">Name <span className="text-destructive">*</span></Label>
                <Input id="signup-name" placeholder="Your full name" className="mt-1.5" value={name} onChange={(e) => setName(e.target.value)} />
                {errors.name && <p className="text-destructive text-[12px] mt-1">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="signup-email" className="text-foreground font-medium text-[13px]">Email <span className="text-destructive">*</span></Label>
                <Input id="signup-email" type="email" placeholder="you@example.com" className="mt-1.5" value={email} onChange={(e) => setEmail(e.target.value)} />
                {errors.email && <p className="text-destructive text-[12px] mt-1">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="signup-role" className="text-foreground font-medium text-[13px]">Role <span className="text-destructive">*</span></Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="therapist">Therapist</SelectItem>
                    <SelectItem value="educator">Educator</SelectItem>
                    <SelectItem value="school_leader">School Leader</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {selectedRole === "other" && (
                  <>
                    <Input
                      placeholder="Please specify your role"
                      value={otherRole}
                      onChange={(e) => setOtherRole(e.target.value)}
                      className="mt-2"
                    />
                    {errors.otherRole && <p className="text-destructive text-[12px] mt-1">{errors.otherRole}</p>}
                  </>
                )}
                {errors.role && <p className="text-destructive text-[12px] mt-1">{errors.role}</p>}
              </div>
              <div>
                <Label className="text-foreground font-medium text-[13px] mb-3 block">
                  What resources are you most interested in? <span className="text-destructive">*</span>
                </Label>
                <div className="space-y-2.5">
                  {interestOptions.map((interest) => (
                    <label key={interest} className="flex items-center gap-2.5 cursor-pointer group">
                      <Checkbox
                        checked={selectedInterests.includes(interest)}
                        onCheckedChange={() => toggleInterest(interest)}
                      />
                      <span className="text-[13px] md:text-[14px] text-foreground/80 group-hover:text-foreground transition-colors">
                        {interest}
                      </span>
                    </label>
                  ))}
                  <label className="flex items-start gap-2.5 cursor-pointer group">
                    <Checkbox
                      checked={selectedInterests.includes("custom")}
                      onCheckedChange={() => toggleInterest("custom")}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <span className="text-[13px] md:text-[14px] text-foreground/80 group-hover:text-foreground transition-colors">
                        I'm looking for...
                      </span>
                      {selectedInterests.includes("custom") && (
                        <Input
                          placeholder="Tell us what you're looking for"
                          value={customInterest}
                          onChange={(e) => setCustomInterest(e.target.value)}
                          className="mt-1.5"
                        />
                      )}
                    </div>
                  </label>
                </div>
                {errors.interests && <p className="text-destructive text-[12px] mt-1">{errors.interests}</p>}
              </div>
              <Button type="submit" className="w-full h-12 bg-deep-purple text-white hover:bg-deep-purple/90 font-bold text-[14px] tracking-wide">
                Access the Resource Hub <ArrowRight className="ml-2 h-4 w-4" />
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
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-[28px] md:text-[36px] font-black text-foreground leading-[1.1] mb-3">
              Explore the Resource Library
            </h2>
            <p className="text-[14px] md:text-[16px] text-muted-foreground leading-[1.7] max-w-[620px] mx-auto">
              Browse posters, guides, checklists, and practical tools for supporting children with Developmental Language Disorder.
            </p>
          </div>

          {/* Audience Tabs */}
          <div className="flex justify-center mb-10">
            <Tabs value={activeFilter} onValueChange={(v) => setActiveFilter(v as AudienceFilter)}>
              <TabsList className="bg-muted border border-border">
                <TabsTrigger value="All" className="px-6 data-[state=active]:bg-deep-purple data-[state=active]:text-white">All</TabsTrigger>
                <TabsTrigger value="Parents" className="px-6 data-[state=active]:bg-deep-purple data-[state=active]:text-white">Parents</TabsTrigger>
                <TabsTrigger value="Therapists" className="px-6 data-[state=active]:bg-deep-purple data-[state=active]:text-white">Therapists</TabsTrigger>
                <TabsTrigger value="Educators" className="px-6 data-[state=active]:bg-deep-purple data-[state=active]:text-white">Educators</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => {
              const Icon = typeIcons[resource.type] || FileText;
              return (
                <div key={resource.id} className="relative bg-card rounded-xl border border-border overflow-hidden group shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow">
                  <div className="h-40 bg-muted flex items-center justify-center">
                    <Icon className="h-12 w-12 text-muted-foreground/40" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-foreground mb-1.5 line-clamp-2 leading-snug">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{resource.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{resource.audience}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium capitalize">{resource.type}</span>
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
      <section className="py-16 lg:py-20 bg-muted">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-[28px] md:text-[36px] font-black text-foreground text-center mb-12 leading-[1.1]">
            What our community is saying
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-card rounded-xl p-6 shadow-[var(--shadow-card)] border border-border flex flex-col"
              >
                <Quote className="h-7 w-7 text-primary/30 mb-4 flex-shrink-0" />
                <p className="text-foreground/80 leading-relaxed flex-1 mb-5 italic">
                  "{t.quote}"
                </p>
                <div className="border-t border-border pt-4">
                  <p className="font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 6: FAQ ── */}
      <section className="py-16 lg:py-20 bg-background">
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
      <section className="bg-deep-purple py-20 md:py-24">
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
