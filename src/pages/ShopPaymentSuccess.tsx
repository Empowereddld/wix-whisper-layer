import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { trackVerifiedGuidebookPurchase } from "@/lib/guidebookAnalytics";
import NoIndexHead from "@/components/NoIndexHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, Loader2, XCircle, Download } from "lucide-react";

// Guest order confirmation. verify-payment checks the Stripe session server-side
// and returns a per-purchase access pass; the pass is exchanged for a 5-minute
// download link only when the customer clicks Download.
const ShopPaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [emailAccepted, setEmailAccepted] = useState(false);

  const handleDownload = async () => {
    if (!accessToken) return;
    setDownloading(true);
    setDownloadError(null);
    const w = window.open("", "_blank");
    const { data, error } = await supabase.functions.invoke("guidebook-download", {
      body: { access_token: accessToken },
    });
    setDownloading(false);
    if (error || !data?.url) {
      w?.close();
      setDownloadError("We couldn't prepare your download. Please try again in a moment.");
      return;
    }
    if (w) w.location.href = data.url; else window.location.href = data.url;
  };

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    // Remove the checkout reference from the address bar so it is not kept in
    // history, shared, or picked up by analytics.
    window.history.replaceState(null, "", window.location.pathname);
    if (!sessionId) {
      setStatus("error");
      return;
    }

    let cancelled = false;
    let timer: number | undefined;
    let attempts = 0;
    const MAX_ATTEMPTS = 40; // about 3 minutes of automatic rechecks

    const verify = async () => {
      attempts += 1;
      try {
        const { data, error } = await supabase.functions.invoke("verify-payment", {
          body: { session_id: sessionId },
        });
        if (cancelled) return;
        if (!error && data?.pending) {
          if (attempts < MAX_ATTEMPTS) timer = window.setTimeout(verify, 5000);
          else setStatus("error");
          return;
        }
        if (error || !data?.success) {
          setStatus("error");
          return;
        }
        setAccessToken(data.access_token ?? null);
        setEmailAccepted(data.confirmation_email_accepted === true);
        setStatus("success");
        trackVerifiedGuidebookPurchase(data.analytics_purchase);
      } catch {
        if (!cancelled) setStatus("error");
      }
    };

    verify();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col">
      <NoIndexHead />
      <Header />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6 py-16">
          {status === "verifying" && (
            <>
              <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto" />
              <h1 className="text-2xl font-bold text-foreground">Confirming your payment…</h1>
              <p className="text-muted-foreground" role="status">
                This page will update automatically. Please keep it open.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="h-16 w-16 text-primary mx-auto" />
              <h1 className="text-2xl font-bold text-foreground">Thank you for your purchase! 💜</h1>
              <p className="text-foreground font-semibold">Your Parent Guidebook is ready.</p>
              <p className="text-muted-foreground">
                You can download it below.
                {emailAccepted && " We've also sent a confirmation email with instructions for accessing it again."}
              </p>
              {accessToken ? (
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={downloading}
                  className="inline-flex items-center justify-center gap-2 min-h-[56px] px-10 bg-deep-purple text-deep-purple-foreground text-[16px] font-semibold rounded-md hover:bg-deep-purple/90 transition-colors disabled:opacity-70"
                >
                  {downloading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
                  Download Your Parent Guidebook
                </button>
              ) : (
                <p className="text-muted-foreground">
                  Your purchase is confirmed. Please contact us and we'll help you get your guidebook.
                </p>
              )}
              {downloadError && <p className="text-destructive text-[14px]" role="alert">{downloadError}</p>}
              <div className="pt-2">
                <Link to="/resources" className="text-[14px] font-semibold text-primary hover:underline">
                  Explore more DLD resources →
                </Link>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="h-16 w-16 text-destructive mx-auto" />
              <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
              <p className="text-muted-foreground">
                We couldn't confirm your payment yet. If you were charged, please contact us and we'll make sure you get your guidebook.
              </p>
              <Link to="/shop/parent-guidebook" className="inline-block text-[14px] font-semibold text-primary hover:underline">
                Back to the Parent Guidebook
              </Link>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShopPaymentSuccess;
