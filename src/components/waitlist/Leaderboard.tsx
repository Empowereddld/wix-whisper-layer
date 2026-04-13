import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Crown, Award, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LeaderboardEntry {
  id: string;
  email: string;
  display_name: string;
  points: number;
  referral_count: number;
  tier: number;
  tier_name: string;
  position: number;
}

interface LeaderboardProps {
  currentUserEmail?: string;
}

const getTierColor = (tier: number): string => {
  const colors = [
    "bg-gradient-to-r from-slate-400 to-slate-600",
    "bg-gradient-to-r from-amber-400 to-amber-600",
    "bg-gradient-to-r from-cyan-400 to-cyan-600",
    "bg-gradient-to-r from-purple-500 to-purple-700",
    "bg-gradient-to-r from-violet-600 to-violet-800",
    "bg-gradient-to-r from-yellow-400 to-yellow-600",
  ];
  return colors[tier] || colors[0];
};

const getTierIcon = (position: number) => {
  if (position === 1) return <Crown className="w-5 h-5 text-yellow-300" />;
  if (position === 2) return <Award className="w-5 h-5 text-gray-300" />;
  if (position === 3) return <Award className="w-5 h-5 text-orange-600" />;
  return <Zap className="w-5 h-5 text-white/40" />;
};

const Leaderboard = ({ currentUserEmail }: LeaderboardProps) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke(
          "get-waitlist-leaderboard"
        );

        if (error) throw error;

        const sortedData = (data || [])
          .sort(
            (a: LeaderboardEntry, b: LeaderboardEntry) =>
              b.points - a.points
          )
          .slice(0, 10)
          .map((entry: LeaderboardEntry, index: number) => ({
            ...entry,
            position: index + 1,
          }));

        setEntries(sortedData);
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("leaderboard")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "storybuilders_waitlist",
        },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 sm:p-8"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Top 10 Leaderboard</h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-white/5 border border-white/10 rounded-lg animate-pulse"
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
      transition={{ duration: 0.5, delay: 0.2 }}
      className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 sm:p-8"
    >
      <h3 className="text-xl font-semibold text-white mb-6">Top 10 Leaderboard</h3>

      <div className="space-y-3" role="table">
        {entries.map((entry) => (
          <motion.div
            key={entry.id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: entries.indexOf(entry) * 0.05 }}
            className={`backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 transition-all duration-300 ${
              currentUserEmail === entry.email
                ? "ring-2 ring-[#8861d4]/50 bg-white/10"
                : "hover:bg-white/8"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                {/* Rank */}
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                  {getTierIcon(entry.position)}
                </div>

                {/* Position and Name */}
                <div className="min-w-0">
                  <p className="text-white/60 text-xs">#{entry.position}</p>
                  <p className="text-white font-semibold truncate">
                    {entry.display_name}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 flex-shrink-0">
                {/* Tier Badge */}
                <div
                  className={`${getTierColor(entry.tier)} rounded-full px-3 py-1 text-xs font-bold text-white shadow-lg`}
                >
                  {entry.tier_name}
                </div>

                {/* Points */}
                <div className="text-right">
                  <p className="text-white/60 text-xs">Points</p>
                  <motion.p
                    key={entry.points}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="text-white font-bold text-lg"
                  >
                    {entry.points}
                  </motion.p>
                </div>

                {/* Referral Count */}
                <div className="text-right">
                  <p className="text-white/60 text-xs">Referred</p>
                  <p className="text-green-400 font-bold text-lg">
                    {entry.referral_count}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {entries.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/60">No leaderboard data yet. Be the first!</p>
        </div>
      )}
    </motion.div>
  );
};

export default Leaderboard;
