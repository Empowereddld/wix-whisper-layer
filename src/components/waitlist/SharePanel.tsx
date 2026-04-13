import { useState } from "react";
import { motion } from "motion/react";
import {
  MessageCircle,
  Facebook,
  Mail,
  Linkedin,
  Link2,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SharePanelProps {
  referralLink: string;
  onShare?: (platform: string) => void;
}

const SharePanel = ({ referralLink, onShare }: SharePanelProps) => {
  const [isSharing, setIsSharing] = useState(false);

  const messages = {
    whatsapp: `Hey! I just found this app being built for kids with DLD (Developmental Language Disorder). Story Pros helps them learn to read and communicate through personalized storytelling. Check it out and join the waitlist! ${referralLink}`,
    twitter: `Just discovered Story Pros - an incredible new app helping kids with DLD learn to read and communicate through personalized stories. Excited to see this launch! ${referralLink} #Education #EdTech #Accessibility`,
    facebook: `I'm so excited about a new app called Story Pros! It's designed specifically to help children with Developmental Language Disorders learn to read and communicate through personalized storytelling. It's such an important tool for families like mine. Join the waitlist! ${referralLink}`,
    linkedin: `I'm thrilled to share Story Pros - a pioneering educational app designed to support children with Developmental Language Disorders. By combining personalized storytelling with evidence-based techniques, Story Pros is making a real impact on literacy and communication. If you care about accessibility in edtech, check it out! ${referralLink}`,
    email: `Hi!\n\nI wanted to share something I think you'll love. There's a new app called Story Pros that's being built specifically to help kids with DLD (Developmental Language Disorder) learn to read and communicate through personalized storytelling.\n\nI think this could be really meaningful, and I'd love for you to check it out and join the waitlist!\n\n${referralLink}\n\nLet me know what you think!\n\nBest`,
  };

  const shareConfigs = [
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: MessageCircle,
      color: "bg-[#25D366]",
      hoverColor: "hover:bg-[#1FAA4F]",
      action: async () => {
        const text = encodeURIComponent(messages.whatsapp);
        const url = `https://wa.me/?text=${text}`;
        window.open(url, "_blank");
      },
    },
    {
      id: "facebook",
      label: "Facebook",
      icon: Facebook,
      color: "bg-[#1877F2]",
      hoverColor: "hover:bg-[#0A66C2]",
      action: async () => {
        const text = encodeURIComponent(messages.facebook);
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}&quote=${text}`;
        window.open(url, "_blank");
      },
    },
    {
      id: "twitter",
      label: "X/Twitter",
      icon: Share2,
      color: "bg-black",
      hoverColor: "hover:bg-gray-800",
      action: async () => {
        const text = encodeURIComponent(messages.twitter);
        const url = `https://twitter.com/intent/tweet?text=${text}`;
        window.open(url, "_blank");
      },
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      icon: Linkedin,
      color: "bg-[#0A66C2]",
      hoverColor: "hover:bg-[#084B94]",
      action: async () => {
        const text = encodeURIComponent(messages.linkedin);
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`;
        window.open(url, "_blank");
      },
    },
    {
      id: "email",
      label: "Email",
      icon: Mail,
      color: "bg-[#EA4335]",
      hoverColor: "hover:bg-[#C5221F]",
      action: async () => {
        const subject = encodeURIComponent("Check out Story Pros");
        const body = encodeURIComponent(messages.email);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
      },
    },
    {
      id: "copy",
      label: "Copy Link",
      icon: Link2,
      color: "bg-purple-600",
      hoverColor: "hover:bg-purple-700",
      action: async () => {
        await navigator.clipboard.writeText(referralLink);
        toast.success("Link copied to clipboard!");
      },
    },
  ];

  const handleShare = async (config: typeof shareConfigs[0]) => {
    try {
      setIsSharing(true);

      // Log share event to Supabase
      await supabase.functions.invoke("log-waitlist-event", {
        body: {
          eventType: "share",
          platform: config.id,
        },
      });

      // Execute the share action
      await config.action();

      // Call the optional callback
      onShare?.(config.id);

      if (config.id !== "copy") {
        toast.success(`Shared on ${config.label}!`);
      }
    } catch (error) {
      console.error("Share error:", error);
      toast.error("Failed to share");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 sm:p-8"
    >
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">Share Your Link</h3>
        <p className="text-white/70 text-sm">
          Invite friends and climb the leaderboard!
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {shareConfigs.map((config, index) => {
          const IconComponent = config.icon;
          return (
            <motion.div
              key={config.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Button
                onClick={() => handleShare(config)}
                disabled={isSharing}
                className={`w-full h-12 sm:h-14 rounded-xl flex items-center justify-center gap-2 text-white font-medium transition-all duration-200 ${config.color} ${config.hoverColor} disabled:opacity-50`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="hidden sm:inline text-sm">{config.label}</span>
              </Button>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
        <p className="text-xs sm:text-sm text-white/60">
          💡 Tip: Each share helps you climb the leaderboard and unlock exclusive rewards!
        </p>
      </div>
    </motion.div>
  );
};

export default SharePanel;
