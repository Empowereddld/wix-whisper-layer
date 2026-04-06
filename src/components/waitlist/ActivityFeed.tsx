import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Zap, Trophy, Award, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface ActivityEvent {
  id: string;
  eventType: "signup" | "tier_promotion" | "badge_earned" | "referral";
  displayName: string;
  message: string;
  timestamp: string;
  metadata?: {
    tierName?: string;
    badgeName?: string;
  };
}

const getEventIcon = (eventType: string) => {
  switch (eventType) {
    case "signup":
      return <Mail className="w-5 h-5 text-blue-400" />;
    case "tier_promotion":
      return <Trophy className="w-5 h-5 text-yellow-400" />;
    case "badge_earned":
      return <Award className="w-5 h-5 text-purple-400" />;
    case "referral":
      return <Heart className="w-5 h-5 text-red-400" />;
    default:
      return <Zap className="w-5 h-5 text-white/40" />;
  }
};

const getEventColor = (eventType: string) => {
  switch (eventType) {
    case "signup":
      return "from-blue-500/10 to-blue-600/10 border-blue-500/20";
    case "tier_promotion":
      return "from-yellow-500/10 to-yellow-600/10 border-yellow-500/20";
    case "badge_earned":
      return "from-purple-500/10 to-purple-600/10 border-purple-500/20";
    case "referral":
      return "from-red-500/10 to-red-600/10 border-red-500/20";
    default:
      return "from-white/5 to-white/10 border-white/20";
  }
};

const ActivityFeed = () => {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("waitlist_events")
          .select(
            `
            id,
            event_type,
            user:user_id(display_name),
            created_at,
            metadata
          `
          )
          .in("event_type", ["signup", "tier_promotion", "badge_earned", "referral"])
          .order("created_at", { ascending: false })
          .limit(20);

        if (error) throw error;

        const formatted = (data || []).map((event: any) => ({
          id: event.id,
          eventType: event.event_type,
          displayName: event.user?.display_name || "Anonymous",
          message: getEventMessage(event.event_type, event.metadata),
          timestamp: event.created_at,
          metadata: event.metadata,
        }));

        setEvents(formatted);
      } catch (error) {
        console.error("Failed to fetch activity:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("activity-feed")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "waitlist_events",
        },
        (payload) => {
          const event = payload.new as any;
          const newEvent: ActivityEvent = {
            id: event.id,
            eventType: event.event_type,
            displayName: "New Member",
            message: getEventMessage(event.event_type, event.metadata),
            timestamp: event.created_at,
            metadata: event.metadata,
          };
          setEvents((prev) => [newEvent, ...prev].slice(0, 20));
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const getEventMessage = (eventType: string, metadata?: any): string => {
    switch (eventType) {
      case "signup":
        return "just joined the waitlist!";
      case "tier_promotion":
        return `reached ${metadata?.tierName || "a new tier"}!`;
      case "badge_earned":
        return `earned the ${metadata?.badgeName || "achievement"} badge!`;
      case "referral":
        return "brought a friend to the community!";
      default:
        return "made an update";
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 sm:p-8"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Community Activity</h3>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
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
      transition={{ duration: 0.5, delay: 0.3 }}
      className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 sm:p-8"
    >
      <h3 className="text-xl font-semibold text-white mb-6">Community Activity</h3>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              layout
              initial={{ opacity: 0, x: -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-gradient-to-r ${getEventColor(event.eventType)} border rounded-lg p-4 flex items-start gap-3 backdrop-blur-sm`}
            >
              {/* Icon */}
              <div className="flex-shrink-0 mt-1">
                {getEventIcon(event.eventType)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <p className="text-white font-semibold truncate">
                    {event.displayName}
                  </p>
                  <p className="text-white/70 text-sm truncate">
                    {event.message}
                  </p>
                </div>
                <p className="text-white/50 text-xs mt-1">
                  {formatDistanceToNow(new Date(event.timestamp), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {events.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center py-8"
        >
          <p className="text-white/60">
            No activity yet. Be the first to make an impact!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ActivityFeed;
