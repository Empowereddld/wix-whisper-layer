import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Heart } from "lucide-react";

interface ImpactCounterProps {
  referralCount: number;
}

const AnimatedCounter = ({ value }: { value: number }) => {
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    let currentValue = 0;
    const target = value;
    const increment = Math.max(1, Math.ceil(target / 30));
    const interval = setInterval(() => {
      currentValue += increment;
      if (currentValue >= target) {
        currentValue = target;
        clearInterval(interval);
      }
      node.textContent = currentValue.toString();
    }, 30);

    return () => clearInterval(interval);
  }, [value]);

  return <span ref={nodeRef}>0</span>;
};

const ImpactCounter = ({ referralCount }: ImpactCounterProps) => {
  // Assuming each referral = 1 family
  const familiesReached = referralCount;
  // Estimated 4-5 family members per family who benefit
  const peopleImpacted = familiesReached * 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="relative backdrop-blur-xl bg-gradient-to-br from-red-500/20 via-pink-500/20 to-purple-500/20 border border-red-400/30 rounded-2xl p-8 overflow-hidden"
    >
      {/* Animated background elements */}
      <motion.div
        animate={{
          opacity: [0.1, 0.3, 0.1],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-0 right-0 w-40 h-40 bg-red-500 rounded-full blur-3xl"
      />

      <motion.div
        animate={{
          opacity: [0.05, 0.2, 0.05],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
        className="absolute bottom-0 left-0 w-40 h-40 bg-pink-500 rounded-full blur-3xl"
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start gap-4 mb-6">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex-shrink-0 mt-1"
          >
            <Heart className="w-8 h-8 text-red-400 fill-red-400" />
          </motion.div>

          <div className="flex-1">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
              Your Impact
            </h3>
            <p className="text-white/70 text-sm">
              Making a real difference in children's lives
            </p>
          </div>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Families Reached */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 border border-white/20 rounded-xl p-4 text-center"
          >
            <p className="text-white/60 text-xs sm:text-sm mb-2">
              Families Reached
            </p>
            <motion.p
              key={familiesReached}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-3xl sm:text-4xl font-black text-red-400"
            >
              <AnimatedCounter value={familiesReached} />
            </motion.p>
          </motion.div>

          {/* People Impacted */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 border border-white/20 rounded-xl p-4 text-center"
          >
            <p className="text-white/60 text-xs sm:text-sm mb-2">
              People Impacted
            </p>
            <motion.p
              key={peopleImpacted}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-3xl sm:text-4xl font-black text-pink-400"
            >
              <AnimatedCounter value={peopleImpacted} />
            </motion.p>
          </motion.div>
        </div>

        {/* Impact Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 border border-white/20 rounded-xl p-4 text-center"
        >
          <p className="text-white font-semibold text-sm sm:text-base">
            Because of you,{" "}
            <span className="text-red-400">
              <AnimatedCounter value={familiesReached} />
            </span>{" "}
            more{" "}
            <span className="text-pink-300">families with children who have DLD</span>{" "}
            will have access to Story Builders.
          </p>
        </motion.div>

        {/* Encouraging message */}
        {familiesReached > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-center"
          >
            <p className="text-white/80 text-xs sm:text-sm">
              {familiesReached === 1 && "🎯 You're just getting started!"}
              {familiesReached >= 2 && familiesReached < 5 && "🌟 Keep going!"}
              {familiesReached >= 5 && familiesReached < 10 && "🚀 Amazing growth!"}
              {familiesReached >= 10 && "🏆 You're a true advocate!"}
            </p>
          </motion.div>
        )}

        {familiesReached === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-center"
          >
            <p className="text-white/60 text-xs sm:text-sm">
              Share your link to start making an impact! 💪
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ImpactCounter;
