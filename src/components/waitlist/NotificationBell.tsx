import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell,
  Users,
  Zap,
  Trophy,
  MessageCircle,
  X,
} from "lucide-react";

interface Notification {
  id: string;
  type: "share" | "points" | "badge" | "community";
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationBellProps {
  userEmail: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ userEmail }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications from localStorage
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        // Mock notifications - in real app would fetch from waitlist_events
        const mockNotifications: Notification[] = [
          {
            id: "1",
            type: "share",
            message: "Someone used your link!",
            timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
            read: false,
          },
          {
            id: "2",
            type: "points",
            message: "You earned 25 points!",
            timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
            read: false,
          },
          {
            id: "3",
            type: "badge",
            message: "You unlocked a new badge!",
            timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
            read: false,
          },
          {
            id: "4",
            type: "community",
            message: "Community hit 1,000 members!",
            timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
            read: true,
          },
        ];

        // Get stored read states from localStorage
        const storedReadStates = localStorage.getItem(
          `notif-read-${userEmail}`
        );
        if (storedReadStates) {
          const readStates = JSON.parse(storedReadStates);
          mockNotifications.forEach((notif) => {
            notif.read = readStates[notif.id] || notif.read;
          });
        }

        setNotifications(mockNotifications);
        const unread = mockNotifications.filter((n) => !n.read).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error("Failed to load notifications:", error);
      }
    };

    loadNotifications();
  }, [userEmail]);

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );

    const readStates = Object.fromEntries(
      notifications.map((n) => [
        n.id,
        n.id === notificationId ? true : n.read,
      ])
    );
    localStorage.setItem(
      `notif-read-${userEmail}`,
      JSON.stringify(readStates)
    );

    setUnreadCount(Math.max(0, unreadCount - 1));
  };

  const clearAll = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    localStorage.setItem(`notif-read-${userEmail}`, JSON.stringify({}));
    setUnreadCount(0);
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffMs = now.getTime() - notifTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return notifTime.toLocaleDateString();
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "share":
        return <MessageCircle className="w-5 h-5" />;
      case "points":
        return <Zap className="w-5 h-5" />;
      case "badge":
        return <Trophy className="w-5 h-5" />;
      case "community":
        return <Users className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "share":
        return "text-blue-400";
      case "points":
        return "text-yellow-400";
      case "badge":
        return "text-purple-400";
      case "community":
        return "text-green-400";
      default:
        return "text-white";
    }
  };

  return (
    <div className="relative">
      {/* Bell button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 text-white hover:bg-white/10 rounded-full transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bell className="w-6 h-6" />

        {/* Unread badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse animation when there are unread notifications */}
        {unreadCount > 0 && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-red-500"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [1, 0, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                scale: [1, 1.2],
                opacity: [0.5, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            />
          </>
        )}
      </motion.button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Notification dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 w-96 max-w-[90vw] bg-gray-950 border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gray-900">
                <div>
                  <h3 className="text-white font-semibold">Notifications</h3>
                  <p className="text-xs text-white/60">
                    {unreadCount} unread
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Notifications list */}
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-white/60">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {notifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => markAsRead(notification.id)}
                        className={`p-4 cursor-pointer transition-colors ${
                          notification.read
                            ? "bg-gray-950/50 hover:bg-gray-900"
                            : "bg-gray-900 hover:bg-gray-850"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-1 ${getNotificationColor(
                              notification.type
                            )}`}
                          >
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white font-medium">
                              {notification.message}
                            </p>
                            <p className="text-xs text-white/50 mt-1">
                              {formatTime(notification.timestamp)}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-white/10 bg-gray-900">
                  <button
                    onClick={clearAll}
                    className="w-full text-center text-xs text-white/60 hover:text-white transition-colors py-2 hover:bg-white/5 rounded"
                  >
                    Mark all as read
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
