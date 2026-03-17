import { Share2, Facebook } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  resourceId: string;
  resourceTitle: string;
  userId?: string;
}

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const SocialShareButtons = ({ resourceId, resourceTitle, userId }: Props) => {
  const shareUrl = `${window.location.origin}/hub/resource/${resourceId}`;

  const trackShare = () => {
    if (userId) {
      supabase.from("share_events").insert({ user_id: userId, resource_id: resourceId }).then(() => {});
    }
  };

  const shareToFacebook = () => {
    trackShare();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank", "width=600,height=400");
  };

  const shareToX = () => {
    trackShare();
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(resourceTitle)}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    trackShare();
  };

  return (
    <div className="flex items-center gap-3 mt-5">
      <span className="text-sm font-medium text-stone-ui">Share</span>
      <button
        onClick={shareToFacebook}
        className="flex items-center justify-center w-9 h-9 rounded-full bg-[#1877F2] text-white hover:opacity-90 transition-opacity"
        aria-label="Share on Facebook"
      >
        <Facebook className="h-4 w-4" />
      </button>
      <button
        onClick={shareToX}
        className="flex items-center justify-center w-9 h-9 rounded-full bg-midnight text-midnight-foreground hover:opacity-90 transition-opacity"
        aria-label="Share on X"
      >
        <XIcon className="h-4 w-4" />
      </button>
      <button
        onClick={handleCopy}
        className="flex items-center justify-center w-9 h-9 rounded-full border border-border bg-card text-muted-foreground hover:text-midnight transition-colors"
        aria-label="Copy link"
      >
        <Share2 className="h-4 w-4" />
      </button>
    </div>
  );
};

export default SocialShareButtons;
