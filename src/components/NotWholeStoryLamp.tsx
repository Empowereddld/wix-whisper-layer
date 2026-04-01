import { motion } from "motion/react";

const NotWholeStoryLamp = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-tight"
        >
          But this is not
          <br />
          the whole story.
        </motion.h2>

        <div className="mt-10 flex flex-col items-center gap-4">
          {[
            { text: "People with DLD have strengths and talents", delay: 0.2 },
            { text: "Children with DLD can be thoughtful, kind, and great friends", delay: 0.4 },
            { text: "With the right support, people with DLD can thrive", delay: 0.6 },
          ].map((item) => (
            <motion.p
              key={item.text}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: item.delay, duration: 0.8, ease: "easeInOut" }}
              viewport={{ once: true }}
              className="text-base md:text-lg text-muted-foreground font-medium"
            >
              ✦ {item.text}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NotWholeStoryLamp;
