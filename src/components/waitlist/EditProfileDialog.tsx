import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AGE_OPTIONS, HEAR_ABOUT_OPTIONS, HOPE_OPTIONS } from "@/lib/storypros-profile";

export interface EditProfileInitial {
  childAge: number | null;
  hopes: string[];
  hopesOther: string | null;
  hearAbout: string | null;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  referralCode: string;
  initial: EditProfileInitial;
  onSaved?: () => void;
  /** Tweaks copy when an admin is editing on behalf of a user. */
  adminMode?: boolean;
}

const EditProfileDialog = ({
  open,
  onOpenChange,
  referralCode,
  initial,
  onSaved,
  adminMode = false,
}: Props) => {
  const [childAge, setChildAge] = useState<string>(
    initial.childAge != null ? String(initial.childAge) : ""
  );
  const [hopes, setHopes] = useState<string[]>(initial.hopes ?? []);
  const [hopesOther, setHopesOther] = useState<string>(initial.hopesOther ?? "");
  const [hearAbout, setHearAbout] = useState<string>(initial.hearAbout ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Re-sync form state whenever the dialog opens with a new user's data.
  useEffect(() => {
    if (!open) return;
    setChildAge(initial.childAge != null ? String(initial.childAge) : "");
    setHopes(initial.hopes ?? []);
    setHopesOther(initial.hopesOther ?? "");
    setHearAbout(initial.hearAbout ?? "");
    setError(null);
  }, [open, initial.childAge, initial.hopes, initial.hopesOther, initial.hearAbout]);

  const toggleHope = (value: string) => {
    setHopes((prev) => {
      if (prev.includes(value)) return prev.filter((v) => v !== value);
      if (prev.length >= 3) return prev;
      return [...prev, value];
    });
  };

  const handleSave = async () => {
    setError(null);
    if (!childAge) return setError("Please choose your child's age.");
    if (hopes.length === 0) return setError("Pick at least one hope (up to 3).");
    if (hopes.includes("other") && !hopesOther.trim()) {
      return setError("Tell us a bit about your 'Other' hope.");
    }
    if (!hearAbout) return setError("Let us know how you heard about us.");

    setSubmitting(true);
    try {
      const { data, error: invokeErr } = await supabase.functions.invoke(
        "update-waitlist-profile",
        {
          body: {
            referral_code: referralCode,
            child_age: Number(childAge),
            hopes,
            hopes_other: hopes.includes("other") ? hopesOther.trim() : null,
            hear_about: hearAbout,
            // Intentionally NOT sending complete_profile so the +10 bonus
            // is never re-awarded. The edge function only awards on the
            // first transition from null → set, but omitting the flag
            // makes the intent explicit.
          },
        }
      );
      const errMsg = (data as any)?.error;
      if (invokeErr || errMsg) {
        const msg = errMsg || invokeErr?.message || "Could not save changes.";
        setError(msg);
      } else {
        toast.success(adminMode ? "Profile updated." : "Profile saved.");
        onSaved?.();
        onOpenChange(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save changes.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {adminMode ? "Edit user profile" : "Edit your profile"}
          </DialogTitle>
          <DialogDescription>
            {adminMode
              ? "Update this user's profile details. No points will be awarded or removed."
              : "Update your profile any time. No extra points are awarded for changes."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-semibold">Child's age</Label>
              <Select value={childAge} onValueChange={setChildAge}>
                <SelectTrigger className="mt-2">
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

            <div>
              <Label className="text-sm font-semibold">How they heard</Label>
              <Select value={hearAbout} onValueChange={setHearAbout}>
                <SelectTrigger className="mt-2">
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
          </div>

          <div>
            <Label className="text-sm font-semibold">
              Hopes for Story Pros{" "}
              <span className="font-normal text-muted-foreground">
                (pick up to 3 — {hopes.length}/3)
              </span>
            </Label>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {HOPE_OPTIONS.map((opt) => {
                const checked = hopes.includes(opt.value);
                const disabled = !checked && hopes.length >= 3;
                return (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition ${
                      checked
                        ? "border-[#8861d4] ring-1 ring-[#8861d4]/30 bg-[#8861d4]/5"
                        : "border-border hover:border-[#8861d4]/40"
                    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <Checkbox
                      checked={checked}
                      disabled={disabled}
                      onCheckedChange={() => toggleHope(opt.value)}
                    />
                    <span className="text-sm">{opt.label}</span>
                  </label>
                );
              })}
            </div>
            {hopes.includes("other") && (
              <Input
                placeholder="Tell us a bit more…"
                className="mt-2"
                value={hopesOther}
                maxLength={200}
                onChange={(e) => setHopesOther(e.target.value)}
              />
            )}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={submitting}
            className="bg-[#8861d4] hover:bg-[#6a47b8] text-white"
          >
            {submitting ? "Saving…" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
