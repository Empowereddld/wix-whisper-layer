import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download, Share2, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import joinedEarlyImg from "@/assets/storypros-posts/joined_early_vertical.png";
import somethingBigImg from "@/assets/storypros-posts/something_big_vertical.png";
import thisOneMattersImg from "@/assets/storypros-posts/this_one_matters_vertical.png";
import howWasYourDayImg from "@/assets/storypros-posts/how_was_your_day_vertical.png";
import helpingKidsImg from "@/assets/storypros-posts/helping_kids_vertical.png";
import sharingOnPurposeImg from "@/assets/storypros-posts/sharing_on_purpose_vertical.png";

type CaptionStyle = "broad" | "dld_aware";

interface PostOption {
  id: string;
  image: string;
  alt: string;
  fileName: string;
  isDefault?: boolean;
  captions: Record<CaptionStyle, string>;
}

// Final Phase 2 content. Captions use the literal token "[referral link]"
// which is substituted with the user's real referral URL at render time.
// Image + caption stay coupled by post id, and changing image OR style
// regenerates the caption automatically (unless the user has edited it).
const POSTS: PostOption[] = [
  {
    id: "POST_01_JOINED_EARLY",
    image: joinedEarlyImg,
    alt: "I joined Story Pros early",
    fileName: "joined_early_vertical.png",
    isDefault: true,
    captions: {
      broad: `I just joined Story Pros early 💛

This looks like something really special for kids.

Helping kids feel more confident sharing their thoughts and stories.

Join the waitlist 👇
[referral link]

Save this for later + share with someone who would love this.`,
      dld_aware: `I just joined Story Pros early 💛

Built for kids with Developmental Language Disorder (DLD)
who have more to say than they can express.

This is the kind of support families have been waiting for.

Join the waitlist 👇
[referral link]

Save + share to help more families find this.`,
    },
  },
  {
    id: "POST_02_SOMETHING_BIG",
    image: somethingBigImg,
    alt: "Something big is coming",
    fileName: "something_big_vertical.png",
    captions: {
      broad: `Something big is coming… ✈️

A new way to help kids build confidence through storytelling.

Join the waitlist 👇
[referral link]

Save + share if this resonates.`,
      dld_aware: `Something big is coming… ✈️

Story sessions that build vocabulary, comprehension,
and confidence for children with DLD.

Join the waitlist 👇
[referral link]

Save + share to spread the word.`,
    },
  },
  {
    id: "POST_03_THIS_ONE_MATTERS",
    image: thisOneMattersImg,
    alt: "This one matters",
    fileName: "this_one_matters_vertical.png",
    captions: {
      broad: `This one matters 💛

Some kids just need the right support to be heard.

Join the waitlist 👇
[referral link]

Save + share with someone who needs this.`,
      dld_aware: `This one matters 💛

Built for kids with Developmental Language Disorder (DLD)
who struggle to express what they're thinking.

Join the waitlist 👇
[referral link]

Save + share to raise awareness.`,
    },
  },
  {
    id: "POST_04_HOW_WAS_YOUR_DAY",
    image: howWasYourDayImg,
    alt: "How was your day? I don't know.",
    fileName: "how_was_your_day_vertical.png",
    captions: {
      broad: `"How was your day?"
"I don't know."

There's more there. Always.

Join the waitlist 👇
[referral link]

Save + share if this feels familiar.`,
      dld_aware: `"How was your day?"
"I don't know."

For many kids with DLD, the story is there
but the words are hard to find.

Join the waitlist 👇
[referral link]

Save + share to help more families understand.`,
    },
  },
  {
    id: "POST_05_HELPING_KIDS",
    image: helpingKidsImg,
    alt: "Helping kids tell their stories",
    fileName: "helping_kids_vertical.png",
    captions: {
      broad: `Helping kids tell their stories 💛

Because every child deserves to be understood.

Join the waitlist 👇
[referral link]

Save + share to support this mission.`,
      dld_aware: `Helping kids with DLD tell their stories 💛

Building language, confidence, and connection
through structured storytelling.

Join the waitlist 👇
[referral link]

Save + share to spread awareness.`,
    },
  },
  {
    id: "POST_06_SHARING_ON_PURPOSE",
    image: sharingOnPurposeImg,
    alt: "I'm sharing this on purpose",
    fileName: "sharing_on_purpose_vertical.png",
    captions: {
      broad: `I'm sharing this on purpose 💛

Because more people need to know about this.

Join the waitlist 👇
[referral link]

Save + share to help this reach the right people.`,
      dld_aware: `I'm sharing this on purpose 💛

Too many families don't know what DLD is
or where to find support.

Join the waitlist 👇
[referral link]

Save + share to raise awareness.`,
    },
  },
];

const DEFAULT_POST = POSTS.find((p) => p.isDefault) ?? POSTS[0];


interface SharePostFlowProps {
  referralLink: string | null;
  onShareTracked?: (platform: string) => unknown | Promise<unknown>;
}

const SharePostFlow = ({ referralLink, onShareTracked }: SharePostFlowProps) => {
  const defaultIndex = Math.max(0, POSTS.findIndex((p) => p.id === DEFAULT_POST.id));
  const [activeIndex, setActiveIndex] = useState<number>(defaultIndex);
  const [style, setStyle] = useState<CaptionStyle>("broad");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editedCaptions, setEditedCaptions] = useState<Record<string, string>>({});

  const activeId = POSTS[activeIndex].id;

  const active = useMemo(
    () => POSTS.find((p) => p.id === activeId) ?? DEFAULT_POST,
    [activeId]
  );

  const captionKey = `${active.id}:${style}`;
  // Substitute the [referral link] token with the user's real link (or a
  // friendly fallback if the link hasn't loaded yet). User edits override
  // the generated caption entirely.
  const linkValue = referralLink || "(your referral link will appear here)";
  const baseCaption = active.captions[style].replace(/\[referral link\]/g, linkValue);
  const caption = editedCaptions[captionKey] ?? baseCaption;
  const captionWithLink = caption;


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
      a.download = active.fileName;
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
      <h3 className="font-sans font-bold text-foreground text-lg sm:text-xl mb-1">Share a Post (Make It Yours)</h3>
      <p className="text-sm text-muted-foreground mb-5 leading-snug">
        Pick a vibe, tweak the caption, and share. Sharing helps more families discover this support 💛
      </p>

      {/* STEP 1: Featured image — capped so vertical posters don't dominate */}
      <div className="mb-5">
        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-semibold">
          Start here
        </p>
        <div className="w-full mx-auto rounded-xl border border-border overflow-hidden bg-muted/40 flex items-center justify-center max-w-[260px] sm:max-w-[300px]">
          <img
            src={active.image}
            alt={active.alt}
            className="w-full h-auto max-h-[260px] sm:max-h-[300px] object-contain"
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
            { id: "broad" as const, label: "Broad / viral-friendly" },
            { id: "dld_aware" as const, label: "DLD-aware / educational" },
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
          rows={6}
          className="resize-y min-h-[160px] sm:min-h-[140px] text-sm leading-relaxed w-full"
        />
        <p className="text-xs text-muted-foreground mt-1.5">Make it your own if you'd like</p>
      </div>

      {/* STEP 4: Primary actions — primary stands alone, secondaries cluster */}
      <div className="mt-5 pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Button
          onClick={handleCopyBoth}
          className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto sm:min-w-[220px] flex items-center gap-2"
        >
          <Copy className="h-4 w-4" />
          Copy Caption & Image
        </Button>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:justify-end">
          <Button onClick={handleShare} variant="outline" size="sm" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button onClick={handleDownload} variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Image
          </Button>
          <Button
            onClick={() => setPreviewOpen((v) => !v)}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            {previewOpen ? "Hide preview" : "Preview Post"}
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Sharing helps more families discover this support 💛
      </p>

      {/* Optional preview — sized smaller than the featured image */}
      {previewOpen && (
        <div className="mt-4 flex justify-center">
          <div className="bg-background rounded-xl border border-border overflow-hidden w-full max-w-[220px] sm:max-w-[240px] shadow-sm">
            <div className="px-3 py-1.5 bg-muted/40 border-b border-border">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">
                Preview
              </p>
            </div>
            <div className="aspect-[4/5] w-full overflow-hidden bg-muted/40">
              <img src={active.image} alt={active.alt} className="w-full h-full object-cover" />
            </div>
            <div className="p-2.5 text-[12px] leading-snug whitespace-pre-wrap text-foreground">
              {captionWithLink}
            </div>
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
