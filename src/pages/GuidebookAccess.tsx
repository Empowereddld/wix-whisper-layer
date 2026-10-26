import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import NoIndexHead from "@/components/NoIndexHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BookOpen, Download, Loader2 } from "lucide-react";
import { clearPass, loadPass, passFromHash, savePass } from "@/lib/guidebookPass";

// Personal guidebook access page opened from the confirmation email.
// The pass arrives after "#" (never sent to servers), is moved into tab-only
// storage and removed from the address bar immediately.
const GuidebookAccess = () => {
  const [pass, setPass] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fromHash = passFromHash(window.location.hash);
    if (fromHash) savePass(fromHash);
    if (window.location.hash) window.history.replaceState(null, "", window.location.pathname);
    setPass(fromHash ?? loadPass());
    setReady(true);
  }, []);

  const handleDownload = async () => {
    if (!pass) return;
    setDownloading(true);
    setError(null);
    const w = window.open("", "_blank");
    const { data, error: err } = await supabase.functions.invoke("guidebook-download", {
      body: { access_token: pass },
    });
    setDownloading(false);
    if (err || !data?.url) {
      w?.close();
      if (err && "context" in err && (err as { context?: Response }).context?.status === 403) {
        clearPass();
        setPass(null);
        setError("This access link is no longer active. Please contact us and we'll help you.");
      } else {
        setError("We couldn't prepare your download. Please try again in a moment.");
      }
      return;
    }
    if (w) w.location.href = data.url; else window.location.href = data.url;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NoIndexHead />
      <Helmet>
        <title>Your Parent Guidebook | Empowered DLD</title>
        <meta name="referrer" content="no-referrer" />
      </Helmet>
      <Header />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6 py-16">
          {!ready ? (
            <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
          ) : pass ? (
            <>
              <BookOpen className="h-14 w-14 text-primary mx-auto" />
              <h1 className="text-2xl font-bold text-foreground">Your Parent Guidebook</h1>
              <p className="text-muted-foreground">
                Discussing DLD with Your Child is ready to download. You can save the PDF to your device and print the activities whenever you'd like.
              </p>
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex items-center justify-center gap-2 min-h-[56px] px-10 bg-deep-purple text-deep-purple-foreground text-[16px] font-semibold rounded-md hover:bg-deep-purple/90 transition-colors disabled:opacity-70"
              >
                {downloading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
                Download Your Parent Guidebook
              </button>
              {error && <p className="text-destructive text-[14px]" role="alert">{error}</p>}
              <p className="text-[14px] text-muted-foreground">
                To download again later, use the button in your confirmation email.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-foreground">Open your guidebook from your email</h1>
              <p className="text-muted-foreground">
                {error ?? "Please use the \"Access Your Parent Guidebook\" button in your confirmation email to open your download."}
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

export default GuidebookAccess;
