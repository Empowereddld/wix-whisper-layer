import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ReferralLinkCardProps {
  referralLink: string;
  stats: {
    clicks: number;
    signups: number;
  };
}

// Simple inline QR code generator using SVG
const generateQRCode = (text: string): string => {
  // For production, you might want to use a library like qrcode.react
  // This is a placeholder that generates a simple data URL
  // In real implementation, you'd use a proper QR code library
  const encodedText = encodeURIComponent(text);
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedText}`;
};

const ReferralLinkCard = ({ referralLink, stats }: ReferralLinkCardProps) => {
  const [copied, setCopied] = useState(false);
  const qrCodeUrl = useMemo(() => generateQRCode(referralLink), [referralLink]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const conversionRate =
    stats.clicks > 0
      ? ((stats.signups / stats.clicks) * 100).toFixed(1)
      : "0.0";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 sm:p-8"
    >
      <h3 className="text-xl font-semibold text-white mb-6">Your Referral Link</h3>

      {/* Link Display and Copy Button */}
      <div className="mb-6">
        <div className="flex gap-3 mb-4">
          <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 overflow-hidden">
            <p className="text-white/80 text-sm truncate font-mono">
              {referralLink}
            </p>
          </div>
          <Button
            onClick={handleCopy}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-6 h-12 flex items-center gap-2 transition-all duration-200"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <Check className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <Copy className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
            <span className="hidden sm:inline text-sm font-medium">
              {copied ? "Copied!" : "Copy"}
            </span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Stats */}
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-white/60 text-sm mb-2">Link Clicks</p>
            <motion.p
              key={stats.clicks}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-3xl font-bold text-white"
            >
              {stats.clicks}
            </motion.p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-white/60 text-sm mb-2">Signups</p>
            <motion.p
              key={stats.signups}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-3xl font-bold text-green-400"
            >
              {stats.signups}
            </motion.p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-white/60 text-sm mb-2">Conversion Rate</p>
            <motion.p
              key={conversionRate}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-3xl font-bold text-blue-400"
            >
              {conversionRate}%
            </motion.p>
          </div>
        </div>

        {/* QR Code */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-xl p-4"
        >
          <p className="text-white/60 text-sm mb-4">Scan to Share</p>
          <motion.img
            src={qrCodeUrl}
            alt="QR Code"
            className="w-40 h-40 bg-white rounded-lg p-2"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>
      </div>

      <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
        <p className="text-xs sm:text-sm text-white/60">
          📊 Share your link everywhere - each click and signup earns you points!
        </p>
      </div>
    </motion.div>
  );
};

export default ReferralLinkCard;
