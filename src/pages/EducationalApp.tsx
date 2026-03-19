import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import ChoosePathCTA from "@/components/ChoosePathCTA";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Sparkles, Brain, Users, ArrowRight } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Interactive Storytelling",
    description: "Children build language skills through engaging, narrative-driven activities designed specifically for DLD.",
  },
  {
    icon: Brain,
    title: "Expert-Designed",
    description: "Created by speech-language pathologists and educators who specialize in Developmental Language Disorder.",
  },
  {
    icon: Users,
    title: "Built for Every Child",
    description: "Adaptive difficulty levels ensure every child can participate, grow, and feel successful.",
  },
  {
    icon: Sparkles,
    title: "Fun & Engaging",
    description: "Colorful characters, animations, and rewards keep children motivated and excited to learn.",
  },
];

const EducationalApp = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setLoading(true);
    const { error } = await supabase.from("waitlist").insert({
      name: name.trim(),
      email: email.trim(),
      role: role.trim() || null,
      notes: "Educational App waitlist",
    });
    setLoading(false);

    if (error) {
      toast({ title: "Something went wrong", description: "Please try again later.", variant: "destructive" });
    } else {
      setSubmitted(true);
      toast({ title: "You're on the list! 🎉", description: "We'll notify you as soon as the app launches." });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Educational App — Interactive Storytelling for Children with DLD | Empowered DLD"
        description="Help your child build language skills through interactive storytelling. Designed by experts for children with Developmental Language Disorder. Join the waitlist!"
        path="/shop/educational-app"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
          { name: "Educational App", path: "/shop/educational-app" },
        ]}
      />
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-deep-purple text-deep-purple-foreground py-16 md:py-24 lg:py-32">
          <div className="container px-6 md:px-8 max-w-[1200px] mx-auto">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
              <div className="flex-1 text-center lg:text-left">
                <span className="inline-block text-[11px] md:text-[12px] font-bold uppercase tracking-[0.15em] text-primary-foreground/70 mb-4">
                  Coming Soon
                </span>
                <h1 className="text-[32px] md:text-[44px] lg:text-[54px] font-black leading-[1.08] mb-5">
                  An App That Builds Language Through Stories
                </h1>
                <p className="text-[14px] md:text-[16px] lg:text-[18px] leading-[1.7] text-primary-foreground/80 max-w-[540px] mx-auto lg:mx-0">
                  Help your child build language skills through interactive storytelling. Designed by a team of speech-language pathologists, educators, and families — specifically for children with DLD.
                </p>
              </div>

              {/* Waitlist Form */}
              <div className="w-full max-w-[420px] bg-background rounded-xl p-8 shadow-[var(--shadow-elevated)]">
                {submitted ? (
                  <div className="text-center py-6">
                    <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
                    <h3 className="text-[22px] font-black text-foreground mb-2">You're on the list!</h3>
                    <p className="text-[14px] text-muted-foreground leading-[1.7]">
                      We'll send you an email as soon as the app is ready. Thank you for your support!
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <h3 className="text-[20px] md:text-[22px] font-black text-foreground text-center mb-1">
                      Join the Waitlist
                    </h3>
                    <p className="text-[13px] text-muted-foreground text-center leading-[1.6] mb-2">
                      Be the first to know when we launch.
                    </p>
                    <div>
                      <Label htmlFor="name" className="text-[12px] font-semibold text-foreground/70 uppercase tracking-[0.08em]">Name</Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-[12px] font-semibold text-foreground/70 uppercase tracking-[0.08em]">Email</Label>
                      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="role" className="text-[12px] font-semibold text-foreground/70 uppercase tracking-[0.08em]">I am a… <span className="text-muted-foreground font-normal">(optional)</span></Label>
                      <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Parent, therapist, educator…" className="mt-1" />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full mt-2 font-bold text-[13px] tracking-[0.06em]">
                      {loading ? "Joining…" : "Join the Waitlist"}
                      {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 md:py-24 lg:py-32">
          <div className="container px-6 md:px-8 max-w-[1200px] mx-auto">
            <h2 className="text-[28px] md:text-[38px] lg:text-[46px] font-black text-foreground leading-[1.1] text-center mb-4">
              Why Interactive Storytelling?
            </h2>
            <p className="text-[14px] md:text-[16px] text-muted-foreground leading-[1.7] text-center max-w-[600px] mx-auto mb-12 md:mb-16">
              Research shows storytelling is one of the most effective ways to build vocabulary, sentence structure, and social communication skills in children with DLD.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {features.map((f) => (
                <div key={f.title} className="bg-lavender border border-border/30 rounded-lg p-6 md:p-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <f.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-[18px] md:text-[20px] font-black text-foreground mb-3">{f.title}</h3>
                  <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.7]">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ChoosePathCTA
          label="Want to support DLD in other ways?"
          heading="Explore Our Full Range of Resources"
          subheading="From books to free downloads to professional development — find tools that make a difference."
        />
      </main>
      <Footer />
    </div>
  );
};

export default EducationalApp;
