import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Referral {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: "clicked" | "signed_up" | "verified";
  createdAt: string;
  clickedAt?: string;
  signedUpAt?: string;
}

interface ReferralTrackerProps {
  referralCode: string;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "verified":
      return <Check className="w-4 h-4 text-green-400" />;
    case "signed_up":
      return <Check className="w-4 h-4 text-yellow-400" />;
    case "clicked":
      return <Clock className="w-4 h-4 text-gray-400" />;
    default:
      return <Clock className="w-4 h-4 text-gray-400" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "verified":
      return "bg-green-500/20 text-green-300 border-green-500/30";
    case "signed_up":
      return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    case "clicked":
      return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    default:
      return "bg-gray-500/20 text-gray-300 border-gray-500/30";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "verified":
      return "Verified";
    case "signed_up":
      return "Signed Up";
    case "clicked":
      return "Pending";
    default:
      return "Pending";
  }
};

const ReferralTracker = ({ referralCode }: ReferralTrackerProps) => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [nudgingId, setNudgingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("waitlist_referrals")
          .select("*")
          .eq("referral_code", referralCode)
          .order("created_at", { ascending: false });

        if (error) throw error;

        const formatted = (data || []).map((ref: any) => ({
          id: ref.id,
          firstName: ref.referred_first_name || "Unknown",
          lastName: ref.referred_last_name || "Friend",
          email: ref.referred_email || "",
          status: ref.status || "clicked",
          createdAt: ref.created_at,
          clickedAt: ref.clicked_at,
          signedUpAt: ref.signed_up_at,
        }));

        setReferrals(formatted);
      } catch (error) {
        console.error("Failed to fetch referrals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`referrals-${referralCode}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "waitlist_referrals",
          filter: `referral_code=eq.${referralCode}`,
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

  const handleNudge = async (referralId: string, email: string) => {
    try {
      setNudgingId(referralId);

      const { error } = await supabase.functions.invoke("send-waitlist-email", {
        body: {
          toEmail: email,
          template: "nudge",
          referralCode,
        },
      });

      if (error) throw error;

      toast.success("Nudge sent!");
    } catch (error) {
      console.error("Failed to send nudge:", error);
      toast.error("Failed to send nudge");
    } finally {
      setNudgingId(null);
    }
  };

  const stats = {
    total: referrals.length,
    verified: referrals.filter((r) => r.status === "verified").length,
    signedUp: referrals.filter((r) => r.status === "signed_up").length,
    pending: referrals.filter((r) => r.status === "clicked").length,
  };

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

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-lg p-3 text-center"
        >
          <p className="text-white/60 text-xs mb-1">Total</p>
          <p className="text-white font-bold text-lg">{stats.total}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-white/5 border border-white/10 rounded-lg p-3 text-center"
        >
          <p className="text-white/60 text-xs mb-1">Verified</p>
          <p className="text-green-400 font-bold text-lg">{stats.verified}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-lg p-3 text-center"
        >
          <p className="text-white/60 text-xs mb-1">Signed Up</p>
          <p className="text-yellow-400 font-bold text-lg">{stats.signedUp}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="bg-white/5 border border-white/10 rounded-lg p-3 text-center"
        >
          <p className="text-white/60 text-xs mb-1">Pending</p>
          <p className="text-gray-400 font-bold text-lg">{stats.pending}</p>
        </motion.div>
      </div>

      {/* Referrals List */}
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
              {/* Status Indicator and Name */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex-shrink-0">
                  {getStatusIcon(referral.status)}
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {referral.firstName} {referral.lastName.charAt(0)}.
                  </p>
                  <p className="text-white/50 text-xs truncate">
                    {referral.email}
                  </p>
                </div>
              </div>

              {/* Status Badge and Action */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(
                    referral.status
                  )}`}
                >
                  {getStatusLabel(referral.status)}
                </span>

                {referral.status === "clicked" && (
                  <Button
                    onClick={() => handleNudge(referral.id, referral.email)}
                    disabled={nudgingId === referral.id}
                    size="sm"
                    className="bg-purple-600/50 hover:bg-purple-600 text-white h-8 px-2 text-xs"
                  >
                    {nudgingId === referral.id ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full"
                      />
                    ) : (
                      <Send className="w-3 h-3" />
                    )}
                  </Button>
                )}
              </div>
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

      <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
        <p className="text-xs sm:text-sm text-white/60">
          💡 Send nudges to friends who clicked your link but haven't signed up yet!
        </p>
      </div>
    </motion.div>
  );
};

export default ReferralTracker;
