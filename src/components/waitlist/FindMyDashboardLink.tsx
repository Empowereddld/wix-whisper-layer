import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FindMyDashboardLinkProps {
  className?: string;
}

/**
 * "Already signed up? Find my dashboard" recovery flow.
 * Opens a dialog where the user enters their email; if it matches a
 * waitlist row we email them a one-tap link back to /storypros/dashboard.
 *
 * Auto-opens when the URL contains ?find=1 (used as a fallback target
 * from VerifySuccess when no referral code is available).
 */
const FindMyDashboardLink = ({ className }: FindMyDashboardLinkProps) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("find") === "1") {
      setOpen(true);
      params.delete("find");
      const newSearch = params.toString();
      window.history.replaceState(
        {},
        "",
        window.location.pathname + (newSearch ? `?${newSearch}` : "") + window.location.hash
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "find-storypros-dashboard",
        { body: { email: email.trim().toLowerCase() } }
      );
      if (error) throw error;
      if (data?.found) {
        toast.success(
          "Check your inbox! We just emailed you a link to your dashboard."
        );
        setOpen(false);
        setEmail("");
      } else {
        toast.error(
          "We couldn't find that email. Try signing up or check that you're using the same email you registered with."
        );
      }
    } catch (err) {
      console.error("find dashboard error:", err);
      toast.error("Something went wrong. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className={
            className ||
            "text-[12px] text-white/70 hover:text-white underline underline-offset-2"
          }
        >
          Already signed up? Find my dashboard
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Find your dashboard</DialogTitle>
          <DialogDescription>
            Enter the email you used to join the Story Pros waitlist and
            we'll send you a link to open your dashboard.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recovery-email">Email</Label>
            <Input
              id="recovery-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto"
            >
              {submitting ? "Sending…" : "Email me my link"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FindMyDashboardLink;
