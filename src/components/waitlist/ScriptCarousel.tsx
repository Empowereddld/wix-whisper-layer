import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Copy, Check, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type Script = {
  audience: string;
  body: string; // contains {{referral_link}} placeholder
};

const SCRIPTS: Script[] = [
  {
    audience: "Friend or family",
    body: "Hey! Found a new app and community I think you'd want to know about. Story Pros helps kids retell stories, put their thoughts in order, and find the right words, plus there's a monthly live group for kids on Zoom. I just joined: {{referral_link}}",
  },
  {
    audience: "Teacher or therapist",
    body: "I came across something called Story Pros. It's an app and monthly community built by a speech-language pathologist and a teacher that helps kids with storytelling and narrative language. Thought you'd want a look: {{referral_link}}",
  },
  {
    audience: "General share",
    body: "I'm on the early list for an app called Story Pros. It helps kids build the skills they need to tell stories and express what's on their mind, plus there's a monthly live community for families on Zoom. Worth a look: {{referral_link}}",
  },
  {
    audience: "Personal note",
    body: "Hey, I'm on the early list for Story Pros. It's an app and monthly community for kids who need extra support with storytelling and language. Built by an SLP and a teacher. Thought of you: {{referral_link}}",
  },
  {
    audience: "Invite to join",
    body: "I found something I think you'll want to see. It's called Story Pros, a membership that gives kids structured storytelling practice plus a monthly live gathering with other families. I'm in and would love for you to join me: {{referral_link}}",
  },
  {
    audience: "Parent friend",
    body: "Hey! I just got early access to Story Pros, a new app built by a speech-language pathologist and a teacher that helps kids retell stories, organize their thoughts, and find the right words. You can sign up for early access too: {{referral_link}}",
  },
  {
    audience: "Parent you know",
    body: "Thought of you and your kiddo. Story Pros is an app coming soon that helps kids build storytelling and language skills in a really natural, playful way. You can get in early here: {{referral_link}}",
  },
  {
    audience: "Therapist or teacher",
    body: "If you work with kids who struggle to get their thoughts out, you'll want to see this. Story Pros is a new app built by an SLP and a teacher, and they're letting people in early before it launches: {{referral_link}}",
  },
  {
    audience: "Quick share",
    body: "Hey, check this out. Story Pros is an app and monthly community that helps kids who need extra support with storytelling and putting their thoughts into words. Built by speech-language pathologists and teachers. You can get in early: {{referral_link}}",
  },
  {
    audience: "Casual",
    body: "Hey, check this out. It's an app that helps kids who need a little extra support with storytelling and putting their thoughts into words. You can get in early: {{referral_link}}",
  },
  {
    audience: "Personalized",
    body: "Ok so you know how [child's name] has all these ideas but when they try to explain something it comes out all jumbled? I found this app that's literally built for that. Get in early with me: {{referral_link}}",
  },
  {
    audience: "Quick text",
    body: "Sending you this before I forget. New app for kids who have a million thoughts but can't get them out in order. Made by SLPs and teachers. Thought of you: {{referral_link}}",
  },
];

interface ScriptCarouselProps {
  referralLink: string;
}

const ScriptCarousel = ({ referralLink }: ScriptCarouselProps) => {
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const total = SCRIPTS.length;

  const current = SCRIPTS[index];
  // Visible preview: strip the {{referral_link}} placeholder (and any trailing whitespace/colon before it).
  const stripLink = (text: string) =>
    text.replace(/[\s:]*\{\{referral_link\}\}/g, "").trim();
  // Copy payload: replace placeholder with the real referral link so it's appended on copy.
  const fillLink = (text: string) =>
    text.replace(/\{\{referral_link\}\}/g, referralLink || "https://empowereddld.com/storypros");

  const next = () => {
    setCopied(false);
    setIndex((i) => (i + 1) % total);
  };
  const prev = () => {
    setCopied(false);
    setIndex((i) => (i - 1 + total) % total);
  };

  // Keyboard arrows
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement) {
        const tag = e.target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || e.target.isContentEditable) return;
      }
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleCopy = async () => {
    const text = fillLink(current.body);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Script copied — paste anywhere", {
        description: "Your referral link is included.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy. Try selecting the text manually.");
    }
  };

  return (
    <Card className="bg-background border border-border rounded-2xl shadow-sm p-4 sm:p-6">
      <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
        <div>
          <h3 className="font-sans font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            Scripts to share
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Copy any script. Use it as is or edit before you send. Your referral link is added automatically.
          </p>
        </div>
        <Badge variant="secondary" className="rounded-full">
          {index + 1} / {total}
        </Badge>
      </div>

      <div className="relative">
        {/* Prev button */}
        <button
          type="button"
          onClick={prev}
          aria-label="Previous script"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 sm:-translate-x-3 z-10 h-10 w-10 rounded-full bg-background border border-border shadow-sm flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </button>

        {/* Card */}
        <div className="px-10 sm:px-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-muted/50 border border-border rounded-xl p-4 sm:p-6 min-h-[180px] flex flex-col"
            >
              <Badge className="self-start mb-3 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/10">
                {current.audience}
              </Badge>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap text-sm sm:text-base flex-1">
                {stripLink(current.body)}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Next button */}
        <button
          type="button"
          onClick={next}
          aria-label="Next script"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 sm:translate-x-3 z-10 h-10 w-10 rounded-full bg-background border border-border shadow-sm flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-foreground" />
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-3 mt-4 flex-wrap">
        <div className="flex gap-1.5">
          {SCRIPTS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setCopied(false);
                setIndex(i);
              }}
              aria-label={`Go to script ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground/40"
              }`}
            />
          ))}
        </div>
        <Button
          onClick={handleCopy}
          className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" /> Copy script + link
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

export default ScriptCarousel;
