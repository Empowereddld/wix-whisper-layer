import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SignupData {
  count: number;
  period: "24h" | "7d";
}

const AnimatedNumber = ({ value }: { value: number }) => {
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    let currentValue = 0;
    const target = value;
    const increment = Math.max(1, Math.ceil(target / 20));
    const interval = setInterval(() => {
      currentValue += increment;
      if (currentValue >= target) {
        currentValue = target;
        clearInterval(interval);
      }
      node.textContent = currentValue.toString();
    }, 50);

    return () => clearInterval(interval);
  }, [value]);

  return <span ref={nodeRef}>0</span>;
};

const SocialProofBanner = () => {
  const [signupCount, setSignupCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSignupData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke(
          "get-recent-waitlist-signups"
        );

        if (error) throw error;

        setSignupCount(data?.count || 0);
      } catch (error) {
        console.error("Failed to fetch signup data:", error);
        setSignupCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchSignupData();

    // Refresh every 60 seconds
    const interval = setInterval(fetchSignupData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      className="fixed bottom-6 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-sm z-50"
    >
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl px-4 py-3 sm:px-6 sm:py-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <TrendingUp className="w-5 h-5 text-green-400 flex-shrink-0" />
          </motion.div>

          <div className="flex-1">
            <p className="text-white/80 text-sm font-medium">
              <span className="text-green-400 font-bold">
                <AnimatedNumber value={signupCount} />
              </span>
              {" "}people joined in the last 24 hours
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SocialProofBanner;
