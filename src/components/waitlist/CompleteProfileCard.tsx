import { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, ChevronDown, ChevronUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HOPE_OPTIONS = [
  { value: "understanding_stories", label: "Understanding stories" },
  { value: "retelling", label: "Retelling" },
  { value: "putting_events_in_order", label: "Putting events in order" },
  { value: "vocabulary", label: "Vocabulary" },
  { value: "confidence", label: "Confidence" },
  { value: "other", label: "Other" },
];

const HEAR_ABOUT_OPTIONS = [
  { value: "facebook_group", label: "Facebook group" },
  { value: "friend_or_family", label: "Friend or family referral" },
  { value: "slp_recommendation", label: "SLP recommendation" },
  { value: "social_media", label: "Social media" },
  { value: "other", label: "Other" },
];

const AGE_OPTIONS = Array.from({ length: 16 }, (_, i) => i + 3); // 3..18

interface Props {
  onSubmit: (input: {
    childAge: number;
    hopes: string[];
    hopesOther: string | null;
    hearAbout: string;
  }) => Promise<{ success: boolean; error?: string }>;
}

const CompleteProfileCard = ({ onSubmit }: Props) => {
  const [open, setOpen] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [childAge, setChildAge] = useState<string>("");
  const [hopes, setHopes] = useState<string[]>([]);
  const [hopesOther, setHopesOther] = useState("");
  const [hearAbout, setHearAbout] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const toggleHope = (value: string) => {
    setHopes((prev) => {
      if (prev.includes(value)) return prev.filter((v) => v !== value);
      if (prev.length >= 3) return prev; // max 3
      return [...prev, value];
    });
  };

  const handleSubmit = async () => {
    setError(null);
    if (!childAge) return setError("Please choose your child's age.");
    if (hopes.length === 0) return setError("Pick at least one hope (up to 3).");
    if (hopes.includes("other") && !hopesOther.trim()) {
      return setError("Tell us a bit about your 'Other' hope.");
    }
    if (!hearAbout) return setError("Let us know how you heard about us.");

    setSubmitting(true);
    const result = await onSubmit({
      childAge: Number(childAge),
      hopes,
      hopesOther: hopes.includes("other") ? hopesOther.trim() : null,
      hearAbout,
    });
    setSubmitting(false);
    if (!result.success) setError(result.error || "Something went wrong.");
  };

  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-gradient-to-r from-[#fef6e7] to-[#fff8ec] border-y border-amber-200"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between gap-3 text-left"
          aria-expanded={open}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-400/90 text-white flex items-center justify-center shrink-0">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm sm:text-base font-bold text-[#7a4a00] leading-tight">
                Complete your profile (+10 points)
              </p>
              <p className="text-xs sm:text-sm text-[#7a4a00]/80">
                Takes 30 seconds. Helps us tailor Story Pros to your family.
              </p>
            </div>
          </div>
          {open ? (
            <ChevronUp className="h-5 w-5 text-[#7a4a00] shrink-0" />
          ) : (
            <ChevronDown className="h-5 w-5 text-[#7a4a00] shrink-0" />
          )}
        </button>

        {open && (
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Child's age */}
            <div>
              <Label className="text-sm font-semibold text-[#3d2200]">
                Your child's age
              </Label>
              <Select value={childAge} onValueChange={setChildAge}>
                <SelectTrigger className="mt-2 bg-white">
                  <SelectValue placeholder="Select an age" />
                </SelectTrigger>
                <SelectContent>
                  {AGE_OPTIONS.map((age) => (
                    <SelectItem key={age} value={String(age)}>
                      {age} years old
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* How did you hear */}
            <div>
              <Label className="text-sm font-semibold text-[#3d2200]">
                How did you hear about us?
              </Label>
              <Select value={hearAbout} onValueChange={setHearAbout}>
                <SelectTrigger className="mt-2 bg-white">
                  <SelectValue placeholder="Choose one" />
                </SelectTrigger>
                <SelectContent>
                  {HEAR_ABOUT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Hopes */}
            <div className="md:col-span-2">
              <Label className="text-sm font-semibold text-[#3d2200]">
                What are you most hoping Story Pros will help with?{" "}
                <span className="font-normal text-[#7a4a00]/70">
                  (pick up to 3 — {hopes.length}/3)
                </span>
              </Label>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {HOPE_OPTIONS.map((opt) => {
                  const checked = hopes.includes(opt.value);
                  const disabled = !checked && hopes.length >= 3;
                  return (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border bg-white cursor-pointer transition ${
                        checked
                          ? "border-[#8861d4] ring-1 ring-[#8861d4]/30"
                          : "border-amber-200 hover:border-amber-300"
                      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <Checkbox
                        checked={checked}
                        disabled={disabled}
                        onCheckedChange={() => toggleHope(opt.value)}
                      />
                      <span className="text-sm text-[#3d2200]">{opt.label}</span>
                    </label>
                  );
                })}
              </div>
              {hopes.includes("other") && (
                <Input
                  placeholder="Tell us a bit more…"
                  className="mt-2 bg-white"
                  value={hopesOther}
                  maxLength={200}
                  onChange={(e) => setHopesOther(e.target.value)}
                />
              )}
            </div>

            {error && (
              <p className="md:col-span-2 text-sm text-red-600 -mt-2">{error}</p>
            )}

            <div className="md:col-span-2 flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-[#8861d4] hover:bg-[#6a47b8] text-white"
              >
                {submitting ? "Saving…" : "Save profile (+10 points)"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CompleteProfileCard;
