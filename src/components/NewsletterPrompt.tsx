import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

async function callPrompt(body: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke("newsletter-prompt", { body });
  if (error) throw error;
  return data as { show?: boolean; success?: boolean };
}

/** Resource Library: one-time dialog. Closing (X/Escape) saves nothing. */
export const HubNewsletterPrompt = ({ userId }: { userId?: string }) => {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userId) return;
    // Only ask once per browser session if they close it; it returns next sign-in.
    const key = `nl_prompt_closed_${userId}`;
    try { if (sessionStorage.getItem(key)) return; } catch {}
    callPrompt({ action: "status", kind: "hub" })
      .then((d) => d?.show && setOpen(true))
      .catch(() => {});
  }, [userId]);

  const close = () => {
    try { sessionStorage.setItem(`nl_prompt_closed_${userId}`, "1"); } catch {}
    setOpen(false);
  };

  const submit = async () => {
    setSaving(true);
    try { await callPrompt({ action: "record", kind: "hub", consented: checked }); } catch {}
    setSaving(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Would you like to stay connected?</DialogTitle>
          <DialogDescription className="sr-only">Optional newsletter sign-up</DialogDescription>
        </DialogHeader>
        <label className="flex items-start gap-3 cursor-pointer">
          <Checkbox checked={checked} onCheckedChange={(v) => setChecked(v === true)} className="mt-1" />
          <span className="text-sm leading-relaxed text-foreground">
            Yes, I'd like practical DLD tips, new resources, and occasional updates from Empowered DLD by email.
          </span>
        </label>
        <p className="text-xs text-muted-foreground pl-7">
          Optional. You can unsubscribe at any time. Your Resource Library access is not affected.
        </p>
        <Button onClick={submit} disabled={saving} className="w-full min-h-[44px]">
          Continue to the Resource Library
        </Button>
      </DialogContent>
    </Dialog>
  );
};

const SP_SNOOZE_DAYS = 14;

/** Story Pros: non-blocking card. Ignored = re-shown at most every 14 days. */
export const StoryProsNewsletterPrompt = ({ referralCode }: { referralCode?: string }) => {
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!referralCode) return;
    const key = `nl_prompt_seen_${referralCode}`;
    try {
      const last = Number(localStorage.getItem(key) || 0);
      if (last && Date.now() - last < SP_SNOOZE_DAYS * 86400000) return;
    } catch {}
    callPrompt({ action: "status", kind: "storypros", referral_code: referralCode })
      .then((d) => {
        if (d?.show) {
          setShow(true);
          try { localStorage.setItem(key, String(Date.now())); } catch {}
        }
      })
      .catch(() => {});
  }, [referralCode]);

  const record = async (consented: boolean) => {
    setSaving(true);
    try {
      await callPrompt({ action: "record", kind: "storypros", referral_code: referralCode, consented });
    } catch {}
    setSaving(false);
    setShow(false);
  };

  if (!show) return null;
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
        <h2 className="text-lg font-bold text-foreground mb-3">Want to hear more from Empowered DLD?</h2>
        <label className="flex items-start gap-3 cursor-pointer">
          <Checkbox checked={checked} onCheckedChange={(v) => setChecked(v === true)} className="mt-1" />
          <span className="text-sm leading-relaxed text-foreground">
            Yes, I'd like practical DLD resources, Empowered DLD updates, and occasional Story Pros news by email.
          </span>
        </label>
        <p className="text-xs text-muted-foreground mt-2 pl-7">
          Optional. You'll stay on the Story Pros waitlist whether or not you choose this. You can unsubscribe at any time.
        </p>
        <div className="flex flex-wrap gap-3 mt-4">
          <Button onClick={() => record(checked)} disabled={saving} className="min-h-[44px]">Save my choice</Button>
          <Button variant="outline" onClick={() => record(false)} disabled={saving} className="min-h-[44px]">No thanks</Button>
        </div>
      </div>
    </div>
  );
};
