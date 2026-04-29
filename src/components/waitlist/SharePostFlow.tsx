import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download, Share2, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import shareCardImage from "@/assets/storypros-share-card.jpg";
import storyprosHero from "@/assets/storybuilders-hero.png";
import storyPreviewBg from "@/assets/story-preview-bg.png";

type CaptionStyle = "simple" | "educational";

interface PostOption {
  id: string;
  image: string;
  alt: string;
  captions: Record<CaptionStyle, string>;
}

// Phase 1: placeholder content. Captions/images will be swapped in Phase 2.
// Structure is intentionally generic so we can drop final assets in without
// any component changes.
const POSTS: PostOption[] = [
  {
    id: "post-1",
    image: shareCardImage,
    alt: "Story Pros share graphic — placeholder",
    captions: {
      simple:
        "I just joined the founding waitlist for Story Pros 💜 A new storytelling app for kids who need a little extra support with language. If you know a family who'd love this, take a peek!",
      educational:
        "1 in 14 kids has Developmental Language Disorder (DLD) — and most have never heard the name. Story Pros is a new storytelling app built by an SLP and a teacher to give these kids a place to thrive. Joining the founding waitlist 💜",
    },
  },
  {
    id: "post-2",
    image: storyprosHero,
    alt: "Story Pros hero — placeholder",
    captions: {
      simple:
        "Story time, but make it magical ✨ I'm on the founding waitlist for Story Pros and I think a lot of families are going to love this one.",
      educational:
        "Kids with DLD often struggle with storytelling, sequencing, and vocabulary — skills that shape every part of school. Story Pros is being built to support exactly that. Proud to be on the founding waitlist.",
    },
  },
  {
    id: "post-3",
    image: storyPreviewBg,
    alt: "Story preview — placeholder",
    captions: {
      simple:
        "Saving this for the parents and teachers in my life 💛 Story Pros is launching soon and it looks beautiful.",
      educational:
        "Developmental Language Disorder is more common than autism, but it gets a fraction of the awareness. Tools like Story Pros are part of changing that.",
    },
  },
];

interface SharePostFlowProps {
  referralLink: string | null;
  onShareTracked?: (platform: string) => void | Promise<void>;
}

const SharePostFlow = ({ referralLink, onShareTracked }: SharePostFlowProps) => {
  const [activeId, setActiveId] = useState<string>(POSTS[0].id);
  const [style, setStyle] = useState<CaptionStyle>("simple");
  const [showMore, setShowMore] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editedCaptions, setEditedCaptions] = useState<Record<string, string>>({});

  const active = useMemo(
    () => POSTS.find((p) => p.id === activeId) ?? POSTS[0],
    [activeId]
  );

  const captionKey = `${active.id}:${style}`;
  const baseCaption = active.captions[style];
  const caption = editedCaptions[captionKey] ?? baseCaption;
  const captionWithLink = referralLink ? `${caption}\n\n${referralLink}` : caption;

  const handleSelectPost = (id: string) => {
    setActiveId(id);
    // Reset preview so user sees the new selection
    setPreviewOpen(false);
  };

  const handleCaptionChange = (value: string) => {
    setEditedCaptions((prev) => ({ ...prev, [captionKey]: value }));
  };

  const handleCopyBoth = async () => {
    try {
      await navigator.clipboard.writeText(captionWithLink);
      toast.success("Caption copied! Long-press the image to save it too.");
    } catch {
      toast.error("Couldn't copy. Try selecting the text manually.");
    }
  };

  const handleDownload = async () => {
    try {
      const res = await fetch(active.image);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `story-pros-${active.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Image downloaded.");
    } catch {
      toast.error("Couldn't download. Long-press the image to save instead.");
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(captionWithLink);
    } catch {}
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share({
          title: "Story Pros",
          text: caption,
          url: referralLink || undefined,
        });
        await onShareTracked?.("native_share");
        return;
      } catch {
        // user cancelled or share unavailable — fall through
      }
    }
    toast.success("Caption copied! Paste it into the app of your choice.");
  };

  return (
    <Card className="bg-background border border-border rounded-2xl shadow-sm p-4 sm:p-6">
      <h3 className="font-sans font-bold text-foreground mb-1">Share a Post (Make It Yours)</h3>
      <p className="text-sm text-muted-foreground mb-5 leading-snug">
        Pick a vibe, tweak the caption, and share. Sharing helps more families discover this support 💛
      </p>

      {/* STEP 1: Featured image */}
      <div className="mb-5">
        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-semibold">
          Start here
        </p>
        <div className="w-full rounded-xl border border-border overflow-hidden bg-muted flex items-center justify-center aspect-square sm:aspect-[4/3] max-h-[420px]">
          <img
            src={active.image}
            alt={active.alt}
            className="max-w-full max-h-full object-contain"
            loading="lazy"
          />
        </div>
      </div>

      {/* STEP 2: Caption style selector */}
      <div className="mb-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-semibold">
          Choose a caption style
        </p>
        <div className="grid grid-cols-2 gap-2">
          {([
            { id: "simple" as const, label: "Simple & relatable" },
            { id: "educational" as const, label: "DLD-aware & educational" },
          ]).map((opt) => {
            const selected = style === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setStyle(opt.id)}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm text-left transition-all",
                  selected
                    ? "border-primary bg-primary/5 text-foreground ring-1 ring-primary/30"
                    : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                )}
                aria-pressed={selected}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 3: Editable caption */}
      <div className="mb-5">
        <Textarea
          value={caption}
          onChange={(e) => handleCaptionChange(e.target.value)}
          rows={5}
          className="resize-y min-h-[120px] text-sm leading-relaxed"
        />
        <p className="text-xs text-muted-foreground mt-1.5">Make it your own if you'd like</p>
      </div>

      {/* STEP 4: Primary actions */}
      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <Button
          onClick={handleCopyBoth}
          className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1 sm:flex-none sm:min-w-[220px] flex items-center gap-2"
        >
          <Copy className="h-4 w-4" />
          Copy Caption & Image
        </Button>
        <Button onClick={handleShare} variant="outline" className="flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
        <Button onClick={handleDownload} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Image
        </Button>
        <Button
          onClick={() => setPreviewOpen((v) => !v)}
          variant="ghost"
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          {previewOpen ? "Hide preview" : "Preview Post"}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Sharing helps more families discover this support 💛
      </p>

      {/* Optional preview */}
      {previewOpen && (
        <div className="mt-4 rounded-xl border border-border bg-muted/40 p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3 font-semibold">
            Preview
          </p>
          <div className="bg-background rounded-lg border border-border overflow-hidden max-w-md mx-auto">
            <img src={active.image} alt={active.alt} className="w-full object-cover" />
            <div className="p-3 text-sm whitespace-pre-wrap leading-relaxed">{captionWithLink}</div>
          </div>
        </div>
      )}

      {/* STEP 5: See more post styles */}
      <div className="mt-6 pt-5 border-t border-border">
        <button
          type="button"
          onClick={() => setShowMore((v) => !v)}
          className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          {showMore ? "Hide post styles" : "See more post styles"}
          {showMore ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {showMore && (
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible">
            {POSTS.map((p) => {
              const selected = p.id === activeId;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPost(p.id)}
                  className={cn(
                    "flex-shrink-0 w-32 sm:w-auto aspect-square rounded-lg border-2 overflow-hidden transition-all bg-muted",
                    selected
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-border hover:border-primary/40"
                  )}
                  aria-pressed={selected}
                >
                  <img src={p.image} alt={p.alt} className="w-full h-full object-cover" />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};

export default SharePostFlow;
