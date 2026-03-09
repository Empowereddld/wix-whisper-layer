import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Share2, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  resourceId: string;
  resourceTitle: string;
  userId?: string;
}

const SharePopover = ({ resourceId, resourceTitle, userId }: Props) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/hub/resource/${resourceId}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (userId) {
      await supabase.from("share_events").insert({ user_id: userId, resource_id: resourceId });
    }
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
        <div className="flex gap-2">
          <input readOnly value={shareUrl} className="flex-1 text-xs px-2 py-1.5 rounded border border-thistle bg-card truncate" />
          <Button size="sm" variant="outline" onClick={handleCopy} className="border-thistle shrink-0">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
        </div>
        <p className="text-[11px] text-stone-ui mt-2">Anyone who clicks this link will be invited to create a free account to download.</p>
      </PopoverContent>
    </Popover>
  );
};

export default SharePopover;
