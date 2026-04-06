import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, CheckCircle } from "lucide-react";

interface VerificationBannerProps {
  emailVerified: boolean;
  email: string;
  onResendClick: () => Promise<void>;
}

export function VerificationBanner({
  emailVerified,
  email,
  onResendClick,
}: VerificationBannerProps) {
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const handleResend = async () => {
    setIsResending(true);
    try {
      await onResendClick();
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 4000);
    } catch (error) {
      console.error("Failed to resend verification email:", error);
    } finally {
      setIsResending(false);
    }
  };

  if (emailVerified || dismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-50 mb-4"
      >
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 backdrop-blur-sm bg-opacity-95">
          {/* Glassmorphism effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/5 to-yellow-400/5 pointer-events-none" />

          <div className="relative px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Mail className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-amber-900">
                    Verify your email to earn 5 bonus points
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    Secure your spot and unlock exclusive rewards
                  </p>

                  {resendSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-2 flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-1.5 rounded-md"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Verification email sent to {email}</span>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={handleResend}
                  disabled={isResending || resendSuccess}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md transition-colors duration-200"
                >
                  {isResending ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4"
                      >
                        ⚙️
                      </motion.div>
                      <span>Sending...</span>
                    </>
                  ) : resendSuccess ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Sent</span>
                    </>
                  ) : (
                    <span>Resend Email</span>
                  )}
                </button>

                <button
                  onClick={() => setDismissed(true)}
                  className="p-1.5 text-amber-600 hover:bg-amber-200/50 rounded-md transition-colors duration-200"
                  aria-label="Dismiss banner"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Animated accent line */}
          <motion.div
            className="h-0.5 bg-gradient-to-r from-amber-400 to-yellow-400"
            animate={{ scaleX: [0, 1] }}
            transition={{ duration: 0.6 }}
            style={{ transformOrigin: "left" }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
