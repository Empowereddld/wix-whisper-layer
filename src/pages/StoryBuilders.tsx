import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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
      <section className="bg-deep-purple py-20 md:py-28 lg:py-32">
        <div className="container px-6 md:px-8 flex flex-col items-center text-center gap-6">
          <p className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.22em] text-white/60">
            COMING SOON
          </p>
          <h1 className="text-[32px] md:text-[48px] lg:text-[56px] font-black text-white leading-[1.1] max-w-[800px]">
            The Storytelling App Created to Support Children With DLD
          </h1>
          <p className="text-[14px] md:text-[16px] text-white/80 leading-[1.7] max-w-[620px]">
            StoryBuilders helps children build language through interactive
            stories, structured support, and meaningful practice — that feels
            like a story, not a lesson.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            <Button
              className="h-12 md:h-14 px-8 md:px-10 bg-white text-deep-purple text-[11px] md:text-[12px] lg:text-[13px] font-bold uppercase tracking-[0.12em] rounded-sm hover:bg-white/90 transition-colors duration-200"
            >
              Join the Launch Team
            </Button>
            <Button
              variant="outline"
              className="h-12 md:h-14 px-8 md:px-10 border-white/30 text-white text-[11px] md:text-[12px] lg:text-[13px] font-bold uppercase tracking-[0.12em] rounded-sm hover:bg-white/10 bg-transparent transition-colors duration-200"
            >
              See How It Works
            </Button>
          </div>
          <p className="text-[13px] md:text-[14px] text-white/50 mt-4">
            Created with children with Developmental Language Disorder in mind
          </p>
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
