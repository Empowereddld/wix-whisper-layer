import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import { Lightbulb, Lock, Loader2, ThumbsUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { TIER_THRESHOLDS } from "@/lib/waitlist-constants";

const MAX_LEN = 280;

export const SUGGESTION_CATEGORIES = [
  { value: "story_themes", label: "Story Themes" },
  { value: "characters", label: "Characters" },
  { value: "app_features", label: "App Features" },
  { value: "community_circle", label: "Community Circle Topics" },
  { value: "other", label: "Other" },
] as const;

const CATEGORY_LABEL: Record<string, string> = SUGGESTION_CATEGORIES.reduce(
  (acc, c) => ({ ...acc, [c.value]: c.label }),
  {} as Record<string, string>
);

// Map raw DB statuses → user-facing badge labels
const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  under_review: {
    label: "Considering",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  planned: {
    label: "Building",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  done: {
    label: "Built",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
};

interface Suggestion {
  id: string;
  description: string;
  category: string;
  status: string | null;
  vote_count: number;
  created_at: string;
}

interface SuggestionBoxProps {
  currentTier: number;
  referralCode: string | null;
  submitSuggestion: (
    text: string,
    category: string
  ) => Promise<{ success: boolean; message: string }>;
  voteSuggestion: (
    suggestionId: string
  ) => Promise<{ success: boolean; message: string }>;
}

const TIER_4_THRESHOLD = TIER_THRESHOLDS[3] ?? 130;

const SuggestionBox = ({
  currentTier,
  referralCode,
  submitSuggestion,
  voteSuggestion,
}: SuggestionBoxProps) => {
  const unlocked = currentTier >= 3; // currentTier is 0-indexed; >=3 means Tier 4+
  const [items, setItems] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [category, setCategory] = useState<string>("story_themes");
  const [submitting, setSubmitting] = useState(false);
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
  const [pendingVoteId, setPendingVoteId] = useState<string | null>(null);

  const loadFeed = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("waitlist_suggestions")
      .select("id, description, category, status, vote_count, created_at")
      .order("vote_count", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(100);
    setItems(((data as Suggestion[]) || []));
    setLoading(false);
  }, []);

  const loadVoted = useCallback(async () => {
    if (!referralCode) return;
    const { data } = await supabase.rpc("get_user_voted_suggestions", {
      p_referral_code: referralCode,
    });
    const ids = ((data as { suggestion_id: string }[]) || []).map(
      (r) => r.suggestion_id
    );
    setVotedIds(new Set(ids));
  }, [referralCode]);

  useEffect(() => {
    if (!unlocked) return;
    loadFeed();
    loadVoted();
  }, [unlocked, loadFeed, loadVoted]);

  const remaining = MAX_LEN - text.length;
  const canSubmit = text.trim().length >= 3 && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    const res = await submitSuggestion(text.trim(), category);
    setSubmitting(false);
    if (res.success) {
      setText("");
      setCategory("story_themes");
      loadFeed();
    }
  };

  const handleVote = async (id: string) => {
    if (votedIds.has(id) || pendingVoteId) return;
    setPendingVoteId(id);
    // Optimistic UI
    setVotedIds((prev) => new Set(prev).add(id));
    setItems((prev) =>
      prev.map((s) => (s.id === id ? { ...s, vote_count: s.vote_count + 1 } : s))
    );
    const res = await voteSuggestion(id);
    setPendingVoteId(null);
    if (!res.success) {
      // Roll back optimistic increment unless it was "Already voted"
      const isAlreadyVoted = /already/i.test(res.message);
      if (!isAlreadyVoted) {
        setVotedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        setItems((prev) =>
          prev.map((s) =>
            s.id === id ? { ...s, vote_count: Math.max(0, s.vote_count - 1) } : s
          )
        );
      }
    }
  };

  // ------- Locked state (below Tier 4) -------
  if (!unlocked) {
    return (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-background border border-dashed border-border rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Lock className="w-5 h-5 text-muted-foreground" />
            </div>
            <h3 className="font-sans font-bold text-foreground text-lg sm:text-xl">
              Suggestion Box
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Reach Tier 4 ({TIER_4_THRESHOLD} pts) to unlock the Suggestion Box and help
              shape what we build next.
            </p>
          </div>
        </Card>
      </motion.div>
    );
  }

  // ------- Unlocked -------
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="bg-background border border-border rounded-2xl shadow-sm p-4 sm:p-6 space-y-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Lightbulb className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-foreground text-lg sm:text-xl">
              Suggestion Box
            </h3>
            <p className="text-sm text-muted-foreground">
              Submit ideas and vote on what we build next. Suggestions are anonymous.
            </p>
          </div>
        </div>

        {/* Submit form */}
        <div className="space-y-3">
          <Textarea
            value={text}
            onChange={(e) =>
              setText(e.target.value.slice(0, MAX_LEN))
            }
            placeholder="What would you like to see in Story Pros?"
            className="min-h-[88px] resize-none"
            maxLength={MAX_LEN}
          />
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center flex-1">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="sm:w-[220px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUGGESTION_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span
                className={`text-xs ${
                  remaining < 20 ? "text-amber-600" : "text-muted-foreground"
                }`}
              >
                {remaining} characters left
              </span>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="bg-primary hover:bg-primary/90"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
                </>
              ) : (
                "Submit suggestion"
              )}
            </Button>
          </div>
        </div>

        <div className="border-t border-border pt-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-sans font-semibold text-foreground text-sm">
              Browse and vote
            </h4>
            <span className="text-xs text-muted-foreground">
              {items.length} {items.length === 1 ? "idea" : "ideas"}
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading…
            </div>
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No suggestions yet. Be the first.
            </p>
          ) : (
            <ul className="space-y-3">
              {items.map((s) => {
                const voted = votedIds.has(s.id);
                const statusBadge = s.status ? STATUS_BADGE[s.status] : null;
                return (
                  <li
                    key={s.id}
                    className="flex gap-3 p-3 sm:p-4 rounded-xl border border-border bg-muted/20"
                  >
                    <button
                      type="button"
                      onClick={() => handleVote(s.id)}
                      disabled={voted || pendingVoteId === s.id}
                      aria-pressed={voted}
                      aria-label={voted ? "Upvoted" : "Upvote"}
                      className={`shrink-0 flex flex-col items-center justify-center w-12 h-14 rounded-lg border transition-colors ${
                        voted
                          ? "bg-primary text-primary-foreground border-primary cursor-not-allowed"
                          : "bg-background text-foreground border-border hover:border-primary hover:text-primary"
                      } disabled:opacity-100`}
                    >
                      <ThumbsUp
                        className="w-4 h-4"
                        fill={voted ? "currentColor" : "none"}
                      />
                      <span className="text-xs font-semibold mt-0.5">
                        {s.vote_count}
                      </span>
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground whitespace-pre-wrap break-words">
                        {s.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <Badge
                          variant="outline"
                          className="text-[11px] capitalize"
                        >
                          {CATEGORY_LABEL[s.category] || s.category}
                        </Badge>
                        {statusBadge && (
                          <Badge
                            variant="outline"
                            className={`text-[11px] ${statusBadge.className}`}
                          >
                            {statusBadge.label}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default SuggestionBox;
