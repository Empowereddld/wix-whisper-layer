import { motion } from "motion/react";

const NotWholeStoryLamp = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-[720px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="border border-foreground/15 rounded-2xl p-10 md:p-14 text-center shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] bg-[hsl(258,60%,96%)]"
        >
          <h2 className="text-3xl md:text-4xl lg:text-[46px] font-black tracking-tight text-foreground leading-tight">
            But this is not
            <br />
            the whole story.
          </h2>

          <div className="mt-10 flex flex-col items-center gap-5">
            {[
              { text: "People with DLD have strengths and talents", delay: 0.15 },
              { text: "Children with DLD can be thoughtful, kind, and great friends", delay: 0.3 },
              { text: "With the right support, people with DLD can thrive", delay: 0.45 },
            ].map((item) => (
              <motion.p
                key={item.text}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: item.delay, duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true }}
                className="text-base md:text-lg text-muted-foreground font-medium"
              >
                <span className="text-primary">✦</span> {item.text}
              </motion.p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NotWholeStoryLamp;
