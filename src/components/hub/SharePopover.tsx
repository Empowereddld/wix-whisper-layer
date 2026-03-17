import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Share2, Check, Copy, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
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

const SharePopover = ({ resourceId, resourceTitle, userId }: Props) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/hub/resource/${resourceId}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    trackShare();
  };

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

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="p-1.5 rounded-full bg-white/80 hover:bg-white text-midnight/60 hover:text-midnight transition-all shadow-sm"
          aria-label={`Share ${resourceTitle}`}
        >
          <Share2 className="h-3.5 w-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3" side="bottom" align="end">
        <p className="text-sm font-medium text-midnight mb-2">Share this resource</p>

        {/* Copy link */}
        <div className="flex gap-2 mb-3">
          <input readOnly value={shareUrl} className="flex-1 text-xs px-2 py-1.5 rounded border border-thistle bg-card truncate" />
          <Button size="sm" variant="outline" onClick={handleCopy} className="border-thistle shrink-0">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
        </div>

        {/* Social buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={shareToFacebook}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1877F2] text-white hover:opacity-90 transition-opacity"
            aria-label="Share on Facebook"
          >
            <Facebook className="h-4 w-4" />
          </button>
          <button
            onClick={shareToX}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-midnight text-midnight-foreground hover:opacity-90 transition-opacity"
            aria-label="Share on X"
          >
            <XIcon className="h-3.5 w-3.5" />
          </button>
        </div>

        <p className="text-[11px] text-stone-ui mt-2">Anyone who clicks this link will be invited to create a free account to download.</p>
      </PopoverContent>
    </Popover>
  );
};

export default SharePopover;
