import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "announcement-storypros-dismissed";

// Temporary 60-day Parent Guidebook campaign (started Oct 2026).
// Set CAMPAIGN_ACTIVE to false to restore the original Story Pros banner below.
const CAMPAIGN_ACTIVE = true;
const GUIDEBOOK_CAMPAIGN = {
  storageKey: "announcement-guidebook-dismissed",
  to: "/shop/parent-guidebook",
  bgClass: "bg-campaign",
  content: (
    <>
      <strong>Not sure how to talk to your child about DLD</strong>? Our Parent Guidebook can help →
    </>
  ),
};

type WaitlistStatus = "none" | "verified" | "unverified";

const AnnouncementBar = () => {
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<WaitlistStatus>("none");
  const { user } = useAuth();
  const { pathname } = useLocation();
  const storageKey = CAMPAIGN_ACTIVE ? GUIDEBOOK_CAMPAIGN.storageKey : STORAGE_KEY;

  useEffect(() => {
    if (sessionStorage.getItem(storageKey) !== "1") setVisible(true);
  }, [storageKey]);

  useEffect(() => {
    if (CAMPAIGN_ACTIVE) return;
    let cancelled = false;
    const check = async () => {
      if (!user?.email) {
        setStatus("none");
        return;
      }
      const { data } = await supabase
        .from("storybuilders_waitlist")
        .select("email_verified")
        .eq("email", user.email.toLowerCase())
        .is("deleted_at", null)
        .maybeSingle();
      if (cancelled) return;
      if (!data) setStatus("none");
      else setStatus(data.email_verified ? "verified" : "unverified");
    };
    check();
    return () => {
      cancelled = true;
    };
  }, [user?.email]);

  if (!visible || pathname.replace(/\/+$/, "") === "/shop/parent-guidebook") return null;

  const dismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    sessionStorage.setItem(storageKey, "1");
    setVisible(false);
  };

  // Original Story Pros banner configuration (restore by setting CAMPAIGN_ACTIVE = false).
  let to = "/storypros";
  let bgClass = "bg-golden";
  let content: React.ReactNode = (
    <>
      <strong>Join the Story Pros App Waitlist:</strong> the first app built for kids with DLD →
    </>
  );

  if (status === "verified") {
    to = "/storypros/dashboard";
    content = <>Share your Story Pros referral link and earn rewards →</>;
  } else if (status === "unverified") {
    to = "/storypros";
    content = <>Almost there! Verify your email to unlock your Story Pros dashboard →</>;
  }

  if (CAMPAIGN_ACTIVE) {
    to = GUIDEBOOK_CAMPAIGN.to;
    bgClass = GUIDEBOOK_CAMPAIGN.bgClass;
    content = GUIDEBOOK_CAMPAIGN.content;
  }

  return (
    <div className={`relative ${bgClass} text-white`}>
      <Link
        to={to}
        className="block w-full px-10 py-2 text-center text-[12px] sm:text-[13px] font-medium leading-snug hover:opacity-90 transition-opacity"
      >
        {content}
      </Link>
      <button
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/80 hover:text-white"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default AnnouncementBar;
