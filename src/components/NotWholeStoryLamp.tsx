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
    </LampContainer>
  );
};

export default NotWholeStoryLamp;
