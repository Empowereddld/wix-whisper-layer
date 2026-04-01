import { motion } from "motion/react";
import { LampContainer } from "@/components/ui/lamp";

const NotWholeStoryLamp = () => {
  return (
    <LampContainer>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.5,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-8 bg-gradient-to-br from-foreground to-foreground/80 bg-clip-text text-center text-3xl font-black tracking-tight text-transparent md:text-4xl lg:text-5xl leading-tight"
      >
        But this is not
        <br />
        the whole story.
      </motion.h2>

      <div className="mt-8 flex flex-col items-center gap-4">
        {[
          { text: "People with DLD have strengths and talents", delay: 0.8 },
          { text: "Children with DLD can be thoughtful, kind, and great friends", delay: 1.0 },
          { text: "With the right support, people with DLD can thrive", delay: 1.2 },
        ].map((item) => (
          <motion.p
            key={item.text}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: item.delay,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="text-center text-base md:text-lg text-foreground/70 font-medium"
          >
            ✦ {item.text}
          </motion.p>
        ))}
      </div>
    </LampContainer>
  );
};

export default NotWholeStoryLamp;
