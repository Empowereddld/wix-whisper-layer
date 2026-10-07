import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Mail, Loader2 } from "lucide-react";
import SEOHead from "@/components/SEOHead";

type Status = "idle" | "loading" | "done" | "expired" | "invalid" | "error";

// Requires a click (not automatic) so email link scanners can't confirm on
// the person's behalf.
const NewsletterConfirm = () => {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [status, setStatus] = useState<Status>(token ? "idle" : "invalid");

  const confirm = async () => {
    setStatus("loading");
    const { data, error } = await supabase.functions.invoke("newsletter-confirm", {
      body: { action: "confirm", token },
    });
    if (!error && data?.success) return setStatus("done");
    let code = "";
    try { code = (await (error as any)?.context?.json())?.error ?? ""; } catch { /* ignore */ }
    setStatus(code === "expired_token" ? "expired" : code === "invalid_token" ? "invalid" : "error");
  };

  return (
    <>
      <SEOHead
        title="Confirm your subscription | Empowered DLD"
        description="Confirm your Empowered DLD newsletter subscription."
        path="/newsletter/confirm"
        noindex
      />
      <main className="min-h-screen bg-secondary/40 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-card rounded-2xl shadow-sm border border-border p-8 text-center space-y-4">
          {status === "done" ? (
            <>
              <CheckCircle2 className="h-12 w-12 text-primary mx-auto" />
              <h1 className="text-2xl font-bold text-foreground">You're subscribed</h1>
              <p className="text-muted-foreground">Thanks for confirming. Watch your inbox for a welcome note from us.</p>
            </>
          ) : status === "expired" || status === "invalid" ? (
            <>
              <Mail className="h-12 w-12 text-primary mx-auto" />
              <h1 className="text-2xl font-bold text-foreground">
                {status === "expired" ? "This link has expired" : "This link isn't valid"}
              </h1>
              <p className="text-muted-foreground">
                You can sign up again using the newsletter form at the bottom of any page, and we'll send a new link.
              </p>
              <Button asChild className="min-h-[44px]"><Link to="/">Go to the homepage</Link></Button>
            </>
          ) : (
            <>
              <Mail className="h-12 w-12 text-primary mx-auto" />
              <h1 className="text-2xl font-bold text-foreground">Confirm your subscription</h1>
              <p className="text-muted-foreground">Tap the button below to confirm you'd like to receive the Empowered DLD newsletter.</p>
              {status === "error" && <p className="text-sm text-destructive">Something went wrong. Please try again.</p>}
              <Button onClick={confirm} disabled={status === "loading"} className="w-full min-h-[44px]">
                {status === "loading" ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Confirming...</> : "Confirm my subscription"}
              </Button>
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default NewsletterConfirm;
