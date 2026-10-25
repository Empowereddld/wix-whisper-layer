import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CONSENT_NOTICE, readAnalyticsChoice, saveAnalyticsChoice } from "@/lib/analyticsConsent";
import { measurementId, syncAnalyticsPrivacy, trackGuidebookVisit } from "@/lib/guidebookAnalytics";

export default function AnalyticsPrivacy() {
  const { pathname, search } = useLocation();
  const [editing, setEditing] = useState(false);
  const [choice, setChoice] = useState(readAnalyticsChoice);
  const enabled = Boolean(measurementId());
  useEffect(() => {
    const sync = () => { setChoice(readAnalyticsChoice()); syncAnalyticsPrivacy(); };
    const open = () => setEditing(true);
    window.addEventListener("storage", sync);
    window.addEventListener("edld-analytics-choice", sync);
    window.addEventListener("edld-open-analytics-settings", open);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("edld-analytics-choice", sync);
      window.removeEventListener("edld-open-analytics-settings", open);
    };
  }, []);
  useEffect(() => {
    if (enabled && pathname === "/shop/parent-guidebook") trackGuidebookVisit();
  }, [pathname, search, choice, enabled]);
  if (!enabled || (!editing && (choice || pathname !== "/shop/parent-guidebook"))) return null;
  return (
    <section aria-label="Analytics privacy choices" className="fixed bottom-0 inset-x-0 z-50 bg-background text-foreground border-t border-border shadow-lg">
      <div className="max-w-[1100px] mx-auto p-6 flex flex-col lg:flex-row gap-5 lg:items-center">
        <div className="flex-1">
          <h2 className="font-bold mb-2">Your analytics choice</h2>
          <p className="text-sm text-muted-foreground">{CONSENT_NOTICE}</p>
          <Link to="/privacy-policy" className="text-sm text-primary underline">Privacy policy</Link>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="min-h-[44px]" onClick={() => { saveAnalyticsChoice(false); setEditing(false); }}>Reject analytics</Button>
          <Button variant="outline" className="min-h-[44px]" onClick={() => { saveAnalyticsChoice(true); setEditing(false); }}>Accept analytics</Button>
          {editing && <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>}
        </div>
      </div>
    </section>
  );
}