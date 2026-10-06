import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Mail, Loader2 } from "lucide-react";
import SEOHead from "@/components/SEOHead";

type Status = "idle" | "loading" | "done" | "sent" | "expired" | "invalid" | "error";

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [email, setEmail] = useState(params.get("email") || "");
  const [status, setStatus] = useState<Status>(token ? "loading" : "idle");
  const [error, setError] = useState("");
  const ran = useRef(false);

  // Signed link from an email: unsubscribe automatically.
  useEffect(() => {
    if (!token || ran.current) return;
    ran.current = true;
    (async () => {
      const { data, error: fnError } = await supabase.functions.invoke("email-unsubscribe", { body: { token } });
      if (!fnError && data?.success) {
        if (data.email) setEmail(data.email);
        setStatus("done");
        return;
      }
      const code = (fnError as any)?.context?.status;
      setStatus(code === 410 ? "expired" : code === 400 ? "invalid" : "error");
    })();
  }, [token]);

  // Typed-in email: we only send a confirmation link to that inbox.
  const requestLink = async (value: string) => {
    setStatus("loading");
    setError("");
    const { error: fnError } = await supabase.functions.invoke("email-unsubscribe", { body: { email: value } });
    if (fnError) {
      setError("Something went wrong. Please try again.");
      setStatus("error");
      return;
    }
    setStatus("sent");
  };

  const heading =
    status === "expired" ? "This link has expired" :
    status === "invalid" ? "This link isn't valid" : "Unsubscribe";
  const intro =
    status === "expired" || status === "invalid"
      ? "Enter your email and we'll send you a fresh unsubscribe link."
      : "Enter your email and we'll send a confirmation link to that inbox to finish unsubscribing.";

  return (
    <>
      <SEOHead
        title="Unsubscribe | Empowered DLD"
        description="Opt out of Empowered DLD email communications."
        path="/unsubscribe"
        noindex
      />
      <main className="min-h-screen bg-secondary/40 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-card rounded-2xl shadow-sm border border-border p-8">
          {status === "done" ? (
            <div className="text-center space-y-4">
              <CheckCircle2 className="h-12 w-12 text-primary mx-auto" />
              <h1 className="text-2xl font-bold text-foreground">You're unsubscribed</h1>
              <p className="text-muted-foreground">
                {email ? <span className="font-medium text-foreground">{email}</span> : "Your address"} will no longer
                receive emails from Empowered DLD.
              </p>
              <p className="text-sm text-muted-foreground pt-2">
                Changed your mind? Email{" "}
                <a href="mailto:hello@empowereddld.com" className="text-primary underline">hello@empowereddld.com</a>{" "}
                to opt back in.
              </p>
            </div>
          ) : status === "sent" ? (
            <div className="text-center space-y-4">
              <Mail className="h-12 w-12 text-primary mx-auto" />
              <h1 className="text-2xl font-bold text-foreground">Check your email</h1>
              <p className="text-muted-foreground">
                If that address is on our list, we've sent it a link to confirm. Tap the link in that email to finish
                unsubscribing.
              </p>
            </div>
          ) : status === "loading" && token ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            </div>
          ) : (
            <div className="space-y-5">
              <div className="text-center">
                <Mail className="h-10 w-10 text-primary mx-auto mb-3" />
                <h1 className="text-2xl font-bold text-foreground">{heading}</h1>
                <p className="text-sm text-muted-foreground mt-2">{intro}</p>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.trim()) void requestLink(email.trim());
                }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="email">Email address</Label>
                  <Input id="email" type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full min-h-[44px]" disabled={status === "loading" || !email.trim()}>
                  {status === "loading" ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending...</>) : "Email me a confirmation link"}
                </Button>
              </form>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Unsubscribe;
