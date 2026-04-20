import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Mail, Loader2 } from "lucide-react";
import SEOHead from "@/components/SEOHead";

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const prefilled = params.get("email") || "";
  const [email, setEmail] = useState(prefilled);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  // Auto-submit if email was prefilled in the link.
  useEffect(() => {
    if (prefilled && status === "idle") {
      void submit(prefilled);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefilled]);

  const submit = async (value: string) => {
    setStatus("loading");
    setError("");
    try {
      const { error: fnError } = await supabase.functions.invoke("email-unsubscribe", {
        body: { email: value },
      });
      if (fnError) throw fnError;
      setStatus("done");
    } catch (e: any) {
      setError(e?.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <>
      <SEOHead
        title="Unsubscribe — Empowered DLD"
        description="Opt out of Empowered DLD email communications."
        path="/unsubscribe"
      />
      <main className="min-h-screen bg-[#F8F5FC] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-border p-8">
          {status === "done" ? (
            <div className="text-center space-y-4">
              <CheckCircle2 className="h-12 w-12 text-primary mx-auto" />
              <h1 className="text-2xl font-bold text-foreground">You're unsubscribed</h1>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">{email}</span> will no longer receive
                emails from Empowered DLD.
              </p>
              <p className="text-sm text-muted-foreground pt-2">
                Changed your mind? Email{" "}
                <a href="mailto:hello@empowereddld.com" className="text-primary underline">
                  hello@empowereddld.com
                </a>{" "}
                to opt back in.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="text-center">
                <Mail className="h-10 w-10 text-primary mx-auto mb-3" />
                <h1 className="text-2xl font-bold text-foreground">Unsubscribe</h1>
                <p className="text-sm text-muted-foreground mt-2">
                  We're sorry to see you go. Confirm your email below to stop all communications
                  from Empowered DLD.
                </p>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.trim()) void submit(email.trim());
                }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={status === "loading" || !email.trim()}
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing...
                    </>
                  ) : (
                    "Confirm unsubscribe"
                  )}
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
