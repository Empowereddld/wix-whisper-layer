import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import NoIndexHead from "@/components/NoIndexHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, Loader2, XCircle, Download } from "lucide-react";

// Guest order confirmation. The Stripe checkout session id in the URL is the
// proof of purchase; verify-payment checks it server-side and returns a
// short-lived signed download URL for the private file.
const ShopPaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setStatus("error");
      return;
    }

    const verify = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("verify-payment", {
          body: { session_id: sessionId },
        });

        if (error || !data?.success) {
          console.error("Verification failed:", data?.error || error);
          setStatus("error");
          return;
        }

        setDownloadUrl(data.download_url ?? null);
        setStatus("success");
      } catch {
        setStatus("error");
      }
    };

    verify();
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
              <h1 className="text-2xl font-bold text-foreground">Confirming your order…</h1>
              <p className="text-muted-foreground">This will only take a moment.</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto" />
              <h1 className="text-2xl font-bold text-foreground">Thank you for your purchase!</h1>
              <p className="text-muted-foreground">
                Your Parent Guidebook is ready. We also emailed you a link back to this page so you can download it again anytime.
              </p>
              {downloadUrl ? (
                <a
                  href={downloadUrl}
                  className="inline-flex items-center justify-center gap-2 min-h-[48px] px-8 bg-deep-purple text-deep-purple-foreground text-[14px] font-semibold rounded-md hover:bg-deep-purple/90 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download the Parent Guidebook
                </a>
              ) : (
                <p className="text-muted-foreground">
                  Your download link is on its way by email. If it does not arrive within a few minutes, please contact us.
                </p>
              )}
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
                We couldn't confirm your order. If you were charged, your purchase is still recorded and your download link is on its way by email. Please contact us if it does not arrive.
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
