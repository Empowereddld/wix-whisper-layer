import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface InviteFriendFormProps {
  referralCode: string;
  userName: string;
}

const InviteFriendForm = ({ referralCode, userName }: InviteFriendFormProps) => {
  const [friendName, setFriendName] = useState("");
  const [friendEmail, setFriendEmail] = useState("");
  const [customMessage, setCustomMessage] = useState(
    `Hey! I wanted to share something amazing with you. There's this new app called Story Pros that's being built for kids with DLD (Developmental Language Disorder). I think it could be really meaningful, and I'd love for you to check it out!\n\nJoin the waitlist: ${referralCode}`
  );
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!friendName.trim() || !friendEmail.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(friendEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setIsLoading(true);

      // Send invite via edge function
      const { error } = await supabase.functions.invoke("send-waitlist-email", {
        body: {
          toEmail: friendEmail,
          friendName,
          senderName: userName,
          template: "invite",
          referralCode,
          customMessage,
        },
      });

      if (error) throw error;

      setSent(true);
      toast.success(`Invite sent to ${friendEmail}!`);

      // Reset form after 3 seconds
      setTimeout(() => {
        setFriendName("");
        setFriendEmail("");
        setSent(false);
        setCustomMessage(
          `Hey! I wanted to share something amazing with you. There's this new app called Story Pros that's being built for kids with DLD (Developmental Language Disorder). I think it could be really meaningful, and I'd love for you to check it out!\n\nJoin the waitlist: ${referralCode}`
        );
      }, 2000);
    } catch (error) {
      console.error("Failed to send invite:", error);
      toast.error("Failed to send invite. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 sm:p-8"
    >
      <h3 className="text-xl font-semibold text-white mb-2">Invite a Friend</h3>
      <p className="text-white/70 text-sm mb-6">
        Send a personalized invite to your friend
      </p>

      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mb-4"
            >
              <Check className="w-8 h-8 text-white" />
            </motion.div>
            <p className="text-white font-semibold text-lg mb-2">
              Invite sent!
            </p>
            <p className="text-white/60 text-sm">
              {friendName} will receive your personalized invitation.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Friend Name */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Friend's Name
              </label>
              <input
                type="text"
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                disabled={isLoading}
              />
            </div>

            {/* Friend Email */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Friend's Email
              </label>
              <input
                type="email"
                value={friendEmail}
                onChange={(e) => setFriendEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                disabled={isLoading}
              />
            </div>

            {/* Message Preview */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Message (optional)
              </label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Customize the message sent to your friend"
                rows={4}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                disabled={isLoading}
              />
              <p className="text-white/50 text-xs mt-1">
                The referral link will be included in the email
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-3 font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full"
                  />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Invite
                </>
              )}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
        <p className="text-xs sm:text-sm text-white/60">
          💬 Pro tip: Use a friendly, personalized tone to increase the chance your friend joins!
        </p>
      </div>
    </motion.div>
  );
};

export default InviteFriendForm;
