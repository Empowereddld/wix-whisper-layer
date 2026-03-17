import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const WaitlistForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setLoading(true);
    const { error } = await supabase.from("waitlist").insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      notes: "StoryBuilders waitlist",
    });
    setLoading(false);
    if (error) {
      toast.error(error.message.includes("duplicate") ? "You're already on the list!" : "Something went wrong. Please try again.");
      return;
    }
    setSubmitted(true);
    toast.success("You're on the list!");
  };

  if (submitted) {
    return (
      <p className="text-lg text-muted-foreground text-center">
        Thank you, {name.split(" ")[0]}! We'll be in touch soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-lg mx-auto">
      <Input
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="h-12 bg-white border-border/60 text-base"
      />
      <Input
        placeholder="Email address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="h-12 bg-white border-border/60 text-base"
      />
      <Button type="submit" disabled={loading} className="h-12 px-8 text-base font-medium shrink-0">
        {loading ? "Joining…" : "Join the Waitlist"}
      </Button>
    </form>
  );
};

const StoryBuilders = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <SEOHead
        title="StoryBuilders — Helping Children Become Confident Storytellers | Empowered DLD"
        description="StoryBuilders is an upcoming storytelling platform helping children with Developmental Language Disorder strengthen narrative language, vocabulary, and communication through guided stories."
        path="/storybuilders"
      />
      {/* ─── HERO ─── */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-32 pb-24 sm:pt-44 sm:pb-32">
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-5xl sm:text-7xl font-black tracking-tight leading-[1.08]"
        >
          StoryBuilders
        </motion.h1>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.15 }}
          className="mt-4 text-xl sm:text-2xl text-muted-foreground max-w-md"
        >
          Helping children become confident storytellers.
        </motion.p>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="mt-10 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed"
        >
          StoryBuilders is an upcoming storytelling platform designed to help
          children strengthen narrative language, vocabulary, and communication
          through engaging stories and guided retell.
        </motion.p>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl"
        >
          Join the waitlist to be the first to hear when early access opens.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.55 }}
          className="mt-10 w-full"
        >
          <WaitlistForm />
          <p className="mt-4 text-sm text-muted-foreground/70">
            Be the first to know when early access becomes available.
          </p>
        </motion.div>
      </section>

      {/* ─── DIVIDER ─── */}
      <div className="w-16 h-px bg-border mx-auto" />

      {/* ─── WHY STORYTELLING ─── */}
      <section className="bg-muted py-24 sm:py-32">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="text-3xl sm:text-4xl font-bold tracking-tight"
          >
            Why storytelling matters
          </motion.h2>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.15 }}
            className="mt-8 space-y-6 text-base sm:text-lg text-muted-foreground leading-relaxed"
          >
            <p>
              Narrative language is the foundation for reading, writing, and
              communication.
            </p>
            <p>
              When children learn how stories work, they begin to organize ideas,
              explain events, and express themselves with greater clarity and
              confidence.
            </p>
            <p>
              StoryBuilders was created to help children practice these skills in a
              way that feels engaging, structured, and supportive.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── DIVIDER ─── */}
      <div className="w-16 h-px bg-border mx-auto" />

      {/* ─── FINAL CTA ─── */}
      <section className="max-w-2xl mx-auto px-6 py-24 sm:py-32 text-center">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="text-3xl sm:text-4xl font-bold tracking-tight"
        >
          Be the first to try StoryBuilders
        </motion.h2>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.12 }}
          className="mt-6 text-base sm:text-lg text-muted-foreground"
        >
          Early access will open soon.
        </motion.p>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.2 }}
          className="mt-2 text-base sm:text-lg text-muted-foreground"
        >
          Join the waitlist and we will let you know as soon as StoryBuilders
          becomes available.
        </motion.p>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.35 }}
          className="mt-10"
        >
          <WaitlistForm />
        </motion.div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-12 text-center text-sm text-muted-foreground/60">
        © {new Date().getFullYear()} StoryBuilders
      </footer>
    </div>
  );
};

export default StoryBuilders;
