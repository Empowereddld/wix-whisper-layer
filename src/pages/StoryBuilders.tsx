import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import heroImage from "@/assets/storybuilders-hero.png";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const StoryBuilders = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <SEOHead
        title="StoryBuilders — Helping Children Become Confident Storytellers | Empowered DLD"
        description="StoryBuilders is a storytelling and language development app designed to support children with Developmental Language Disorder through interactive stories, structured support, and meaningful practice."
        path="/storybuilders"
      />
      <Header />

      {/* ─── HERO ─── */}
      <section className="bg-[hsl(30_60%_98%)] py-20 md:py-32">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-10 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Copy */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6"
          >
            <span className="text-xs font-semibold tracking-[0.18em] uppercase text-coral">
              Coming Soon
            </span>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.1] text-foreground">
              The storytelling app created to support children with DLD
            </h1>

            <p className="text-lg leading-relaxed text-muted-foreground max-w-[500px]">
              StoryBuilders helps children build language through interactive
              stories, structured support, and meaningful practice — that feels
              like a story, not a lesson.
            </p>

            <p className="text-sm leading-relaxed text-muted-foreground/80 max-w-[480px]">
              Built to support comprehension, vocabulary, sentence building, and
              retell in one calm, child-friendly experience.
            </p>

            {/* CTA area */}
            <div className="flex flex-wrap gap-3 mt-2">
              <Button
                className="rounded-full h-12 px-8 text-base font-semibold bg-coral text-white hover:bg-coral/90 shadow-[var(--shadow-button)]"
              >
                Join the Launch Team
              </Button>
              <Button
                variant="outline"
                className="rounded-full h-12 px-8 text-base font-semibold border-foreground/20 hover:bg-accent"
              >
                See How It Works
              </Button>
            </div>

            <p className="text-xs text-muted-foreground/60 mt-1">
              Created with children with Developmental Language Disorder in mind.
            </p>
          </motion.div>

          {/* Right — Image */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="flex justify-center md:justify-end"
          >
            <img
              src={heroImage}
              alt="A parent and child reading a story together"
              className="w-full max-w-[520px] rounded-2xl shadow-[var(--shadow-elevated)] object-cover"
            />
          </motion.div>
        </div>
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
              StoryBuilders was created to help children practice these skills in
              a way that feels engaging, structured, and supportive.
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
          Early access will open soon. Join the Launch Team and we'll let you
          know as soon as StoryBuilders becomes available.
        </motion.p>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.3 }}
          className="mt-10"
        >
          <Button
            className="rounded-full h-12 px-10 text-base font-semibold bg-coral text-white hover:bg-coral/90 shadow-[var(--shadow-button)]"
          >
            Join the Launch Team
          </Button>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default StoryBuilders;
