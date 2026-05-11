import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { countries } from "@/lib/countries";
import SEOHead from "@/components/SEOHead";

type Status =
  | { state: "loading" }
  | { state: "invalid"; message: string }
  | {
      state: "ready";
      name: string;
      email: string;
      slot: number;
      alreadyClaimed: boolean;
    }
  | { state: "submitted" };

const SHIRT_SIZES = ["Skip / one-size", "XS", "S", "M", "L", "XL", "2XL", "3XL"];

export default function ClaimFounder() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const { toast } = useToast();
  const [status, setStatus] = useState<Status>({ state: "loading" });
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [recipientName, setRecipientName] = useState("");
  const [street, setStreet] = useState("");
  const [street2, setStreet2] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [postal, setPostal] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [inscriptionTo, setInscriptionTo] = useState("");
  const [inscriptionNote, setInscriptionNote] = useState("");
  const [merchSize, setMerchSize] = useState<string>("Skip / one-size");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus({
        state: "invalid",
        message:
          "This link is missing its access token. Open the Founder email and tap the button again.",
      });
      return;
    }
    (async () => {
      try {
        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/claim-founder-package?token=${encodeURIComponent(token)}`;
        const res = await fetch(url, {
          headers: {
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        });
        const data = await res.json();
        if (!data.ok) {
          const msg =
            data.error === "not_eligible"
              ? "This link isn't eligible for a Founder claim. The 50 Founder slots may already be filled, or you haven't reached Tier 6 yet."
              : data.error === "not_found"
                ? "We couldn't find a Founder slot tied to this link."
                : "This link isn't valid. Please use the button in your Founder email.";
          setStatus({ state: "invalid", message: msg });
          return;
        }
        setRecipientName(data.user.name || "");
        setInscriptionTo(data.user.name?.split(" ")[0] || "");
        setStatus({
          state: "ready",
          name: data.user.name,
          email: data.user.email,
          slot: data.user.founder_slot_number,
          alreadyClaimed: data.user.already_claimed,
        });
      } catch (e) {
        setStatus({
          state: "invalid",
          message: "Something went wrong validating your link. Please try again.",
        });
      }
    })();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status.state !== "ready") return;
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "claim-founder-package",
        {
          body: {
            token,
            recipient_name: recipientName,
            shipping_street: street,
            shipping_street2: street2,
            shipping_city: city,
            shipping_region: region,
            shipping_postal_code: postal,
            shipping_country: country,
            shipping_phone: phone,
            inscription_to: inscriptionTo,
            inscription_note: inscriptionNote,
            merch_size: merchSize === "Skip / one-size" ? "" : merchSize,
            additional_notes: notes,
          },
        },
      );
      if (error || !data?.ok) {
        toast({
          title: "Something went wrong",
          description:
            (data as any)?.error === "missing_fields"
              ? "Please fill in every required field."
              : "Please try again in a moment.",
          variant: "destructive",
        });
        return;
      }
      setStatus({ state: "submitted" });
    } catch (err) {
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Claim your Founder package | Story Pros"
        description="Confirm shipping and inscription details for your Story Pros Founder package."
      />
      <main className="min-h-screen bg-background py-12 md:py-20">
        <div className="container px-6 md:px-8">
          <div className="max-w-[640px] mx-auto">
            <Link
              to="/storypros/dashboard"
              className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground"
            >
              ← Back to dashboard
            </Link>

            {status.state === "loading" && (
              <div className="mt-10 text-center text-muted-foreground">
                Checking your Founder slot…
              </div>
            )}

            {status.state === "invalid" && (
              <div className="mt-10 rounded-2xl border border-border bg-card p-8 text-center">
                <h1 className="text-[28px] md:text-[34px] font-black text-foreground leading-[1.1] mb-3">
                  We couldn't load your claim
                </h1>
                <p className="text-[14px] text-muted-foreground leading-[1.7]">
                  {status.message}
                </p>
              </div>
            )}

            {status.state === "submitted" && (
              <div className="mt-10 rounded-2xl border border-border bg-card p-8 md:p-10 text-center">
                <h1 className="text-[28px] md:text-[36px] font-black text-foreground leading-[1.1] mb-3">
                  You're all set.
                </h1>
                <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.7] mb-6">
                  Your shipping and inscription details are locked in. Once all 50 Founder slots
                  are claimed, we ship everything together. We'll email a tracking number when
                  it's on the way.
                </p>
                <Button asChild>
                  <Link to="/storypros/dashboard">Back to my dashboard</Link>
                </Button>
              </div>
            )}

            {status.state === "ready" && (
              <>
                <div className="mt-6 mb-8 text-center">
                  <p className="inline-block rounded-full bg-primary/10 text-primary px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] mb-4">
                    Founder slot #{status.slot} of 50
                  </p>
                  <h1 className="text-[30px] md:text-[42px] font-black text-foreground leading-[1.05] mb-3">
                    Claim your Founder package
                  </h1>
                  <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.7]">
                    Tell us where to ship your signed Dan &amp; Daria book and DLD-themed merch,
                    and how you'd like the book inscribed. Takes about 60 seconds.
                  </p>
                  {status.alreadyClaimed && (
                    <p className="mt-4 text-[12px] text-muted-foreground italic">
                      You've already submitted these details. Resubmitting won't create a duplicate
                      claim — to update them, email us instead.
                    </p>
                  )}
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-8"
                >
                  {/* Shipping */}
                  <section>
                    <h2 className="text-[16px] font-bold text-foreground mb-4">
                      Shipping address
                    </h2>
                    <div className="space-y-4">
                      <Field label="Recipient name" required>
                        <Input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} required maxLength={120} />
                      </Field>
                      <Field label="Street address" required>
                        <Input value={street} onChange={(e) => setStreet(e.target.value)} required maxLength={200} />
                      </Field>
                      <Field label="Apt / suite / unit" optional>
                        <Input value={street2} onChange={(e) => setStreet2(e.target.value)} maxLength={200} />
                      </Field>
                      <div className="grid md:grid-cols-2 gap-4">
                        <Field label="City" required>
                          <Input value={city} onChange={(e) => setCity(e.target.value)} required maxLength={120} />
                        </Field>
                        <Field label="State / province / region" required>
                          <Input value={region} onChange={(e) => setRegion(e.target.value)} required maxLength={120} />
                        </Field>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <Field label="Postal / ZIP code" required>
                          <Input value={postal} onChange={(e) => setPostal(e.target.value)} required maxLength={30} />
                        </Field>
                        <Field label="Country" required>
                          <Select value={country} onValueChange={setCountry} required>
                            <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                            <SelectContent>
                              {countries.map((c) => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Field>
                      </div>
                      <Field label="Phone (for the carrier)" optional>
                        <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={40} />
                      </Field>
                    </div>
                  </section>

                  {/* Inscription */}
                  <section>
                    <h2 className="text-[16px] font-bold text-foreground mb-4">
                      Book inscription
                    </h2>
                    <div className="space-y-4">
                      <Field label='Make the book out to ("To: ___")' required>
                        <Input value={inscriptionTo} onChange={(e) => setInscriptionTo(e.target.value)} required maxLength={80} placeholder="e.g. Daria, or The Russell Family" />
                      </Field>
                      <Field label="Optional short note from the author" optional>
                        <Textarea value={inscriptionNote} onChange={(e) => setInscriptionNote(e.target.value)} maxLength={280} rows={3} placeholder="A line or two for Dan to write inside the cover. Max 280 characters." />
                      </Field>
                    </div>
                  </section>

                  {/* Merch */}
                  <section>
                    <h2 className="text-[16px] font-bold text-foreground mb-2">
                      DLD-themed merch
                    </h2>
                    <p className="text-[12px] text-muted-foreground mb-4 leading-[1.6]">
                      Most items are one-size. If apparel is included in the final Founder bundle,
                      we'll use the size below. You can leave it as "Skip" if you'd rather we follow
                      up.
                    </p>
                    <Field label="Apparel size (optional)" optional>
                      <Select value={merchSize} onValueChange={setMerchSize}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {SHIRT_SIZES.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </section>

                  {/* Notes */}
                  <section>
                    <Field label="Anything else we should know?" optional>
                      <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={500} rows={3} placeholder="Delivery instructions, gift notes, etc." />
                    </Field>
                  </section>

                  <Button type="submit" disabled={submitting} className="w-full h-12 text-[12px] font-bold uppercase tracking-[0.12em]">
                    {submitting ? "Locking it in…" : "Submit my Founder details"}
                  </Button>
                  <p className="text-[11px] text-muted-foreground text-center leading-[1.6]">
                    A confirmation will be emailed to {status.email}.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

function Field({
  label,
  required,
  optional,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="text-[13px] font-semibold text-foreground mb-1.5 block">
        {label}{" "}
        {required && <span className="text-destructive">*</span>}
        {optional && <span className="text-muted-foreground font-normal">(optional)</span>}
      </Label>
      {children}
    </div>
  );
}
