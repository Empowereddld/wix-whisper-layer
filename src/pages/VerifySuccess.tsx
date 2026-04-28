import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { Check, Sparkles, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import confetti from "canvas-confetti";

const VerifySuccess = () => {
  const [searchParams] = useSearchParams();
  const [points, setPoints] = useState(15);
  const [name, setName] = useState("");
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Parse URL params for points and name
    const pts = searchParams.get("points");
    const nm = searchParams.get("name");
    if (pts) setPoints(parseInt(pts, 10));
    if (nm) setName(nm);

    // Staggered animation
    const timer = setTimeout(() => setShowContent(true), 300);

    // Confetti burst
    const confettiTimer = setTimeout(() => {
      try {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.4 },
          colors: ["#8861d4", "#10B981", "#F59E0B", "#EC4899"],
        });
      } catch {}
    }, 600);

    return () => {
      clearTimeout(timer);
      clearTimeout(confettiTimer);
    };
  }, [searchParams]);

  const firstName = name ? name.split(" ")[0] : "there";
  const ref = searchParams.get("ref");
  const dashboardHref = ref ? `/storypros/dashboard?ref=${encodeURIComponent(ref)}` : "/storypros/dashboard";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f3ebf8] to-white flex items-center justify-center p-4">
      <SEOHead
        title="Email Verified | Story Pros"
        description="Your email is verified and your points are unlocked."
        path="/storypros/verified"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Top gradient header */}
          <div className="bg-gradient-to-r from-primary to-[#6a47b8] p-8 text-center relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <Check className="h-10 w-10 text-emerald-500" strokeWidth={3} />
            </motion.div>
            <h1 className="text-2xl font-bold text-white">You're Verified!</h1>
            <p className="text-white/80 mt-1">Welcome to the Story Pros Launch Team</p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {showContent && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {/* Points celebration */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-100 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-semibold text-amber-700 uppercase tracking-wide">
                      Points Unlocked
                    </span>
                    <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                  </div>
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="text-4xl font-bold text-amber-600"
                  >
                    +{points}
                  </motion.div>
                  <p className="text-sm text-amber-600/80 mt-1">
                    Your first reward for verifying your email
                  </p>
                </div>
              </motion.div>
            )}

            {showContent && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-3"
              >
                <p className="text-center text-muted-foreground leading-relaxed">
                  Hi <strong className="text-foreground">{firstName}</strong>, your email is confirmed and your spot on the Launch Team is secure.
                </p>
                <p className="text-center text-muted-foreground leading-relaxed">
                  Head to your dashboard to see your points, track your tier progress, and start sharing your referral link.
                </p>
              </motion.div>
            )}

            {/* CTA Buttons */}
            {showContent && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-3 pt-2"
              >
                <Button
                  asChild
                  className="flex-1 bg-gradient-to-r from-primary to-[#6a47b8] hover:opacity-90 text-white font-semibold h-12 rounded-xl"
                >
                  <Link to={dashboardHref}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Go to Dashboard
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 h-12 rounded-xl border-2 font-semibold"
                >
                  <Link to="/storypros">
                    Back to Story Pros
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Bottom trust text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-xs text-muted-foreground/60 mt-6"
        >
          Your email is verified. No further confirmation needed.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default VerifySuccess;
