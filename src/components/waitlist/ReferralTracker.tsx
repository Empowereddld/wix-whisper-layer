import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Referral {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface ReferralTrackerProps {
  referralCode: string;
}

const ReferralTracker = ({ referralCode }: ReferralTrackerProps) => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("storybuilders_waitlist")
          .select("id, name, email, created_at")
          .eq("referred_by_code", referralCode)
          .order("created_at", { ascending: false });

        if (error) throw error;

        const formatted = (data || []).map((ref) => ({
          id: ref.id,
          name: ref.name || "Friend",
          email: ref.email || "",
          createdAt: ref.created_at,
        }));

        setReferrals(formatted);
      } catch (error) {
        console.error("Failed to fetch referrals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();

    const channel = supabase
      .channel(`referrals-${referralCode}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "storybuilders_waitlist",
          filter: `referred_by_code=eq.${referralCode}`,
        },
        () => {
          fetchReferrals();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [referralCode]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 sm:p-8"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Referral Status</h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-14 bg-white/5 border border-white/10 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 sm:p-8"
    >
      <h3 className="text-xl font-semibold text-white mb-4">Referral Status</h3>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-lg p-3 text-center"
        >
          <p className="text-white/60 text-xs mb-1">Total</p>
          <p className="text-white font-bold text-lg">{referrals.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-white/5 border border-white/10 rounded-lg p-3 text-center"
        >
          <p className="text-white/60 text-xs mb-1">Signed Up</p>
          <p className="text-green-400 font-bold text-lg">{referrals.length}</p>
        </motion.div>
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto">
        <AnimatePresence>
          {referrals.map((referral, index) => (
            <motion.div
              key={referral.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/8 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex-shrink-0">
                  <Check className="w-4 h-4 text-green-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {referral.name}
                  </p>
                  <p className="text-white/50 text-xs truncate">
                    {referral.email}
                  </p>
                </div>
              </div>
              <span className="px-2 py-1 rounded text-xs font-semibold border bg-green-500/20 text-green-300 border-green-500/30">
                Signed Up
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {referrals.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center py-8"
        >
          <p className="text-white/60">No referrals yet. Share your link to get started!</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ReferralTracker;
