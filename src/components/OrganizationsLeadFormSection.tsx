import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const OrganizationsLeadFormSection = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [orgName, setOrgName] = useState("");
  const [role, setRole] = useState("");
  const [interest, setInterest] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !orgName.trim() || !role) return;

    setIsSubmitting(true);
    const { error } = await supabase.from("lead_captures" as any).insert({
      name: name.trim(),
      email: email.trim(),
      organization_name: orgName.trim(),
      role,
      source: interest.trim()
        ? `organizations_page | interest: ${interest.trim()}`
        : "organizations_page",
    } as any);

    setIsSubmitting(false);

    if (error) {
      toast({ title: "Something went wrong", description: "Please try again later.", variant: "destructive" });
    } else {
      // Fire-and-forget acknowledgment email (server renders from template registry)
      supabase.functions.invoke("send-email", {
        body: {
          template: "org_lead_confirmation",
          to: email.trim(),
          data: {
            name: name.trim(),
            orgName: orgName.trim(),
          },
        },
      }).catch((e) => console.warn("Lead email failed:", e));

      toast({ title: "Thanks for reaching out!", description: "We'll be in touch within 1–2 business days." });
      setName("");
      setEmail("");
      setOrgName("");
      setRole("");
      setInterest("");
    }
  };

  return (
    <section className="py-10 md:py-16 lg:py-[80px] bg-muted">
      <div className="container px-6 md:px-8">
        <div className="max-w-[600px] mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-[28px] md:text-[38px] lg:text-[46px] font-black text-foreground leading-[1.1] mb-3">
              Let's Talk About Your Organization
            </h2>
            <p className="text-[13px] md:text-[14px] lg:text-[16px] text-muted-foreground leading-[1.7]">
              Not ready to book yet? Tell us a little about your team and what you're hoping to accomplish. We'll personally respond with ideas tailored to your needs.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="org-name-field" className="text-[13px] font-semibold text-foreground mb-1.5 block">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input id="org-name-field" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
            </div>

            <div>
              <Label htmlFor="org-email-field" className="text-[13px] font-semibold text-foreground mb-1.5 block">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input id="org-email-field" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@organization.com" />
            </div>

            <div>
              <Label htmlFor="org-org-name-field" className="text-[13px] font-semibold text-foreground mb-1.5 block">
                Organization Name <span className="text-destructive">*</span>
              </Label>
              <Input id="org-org-name-field" required value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Your organization" />
            </div>

            <div>
              <Label htmlFor="org-role-field" className="text-[13px] font-semibold text-foreground mb-1.5 block">
                I am a: <span className="text-destructive">*</span>
              </Label>
              <Select required value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="principal">School Principal or Administrator</SelectItem>
                  <SelectItem value="slp_manager">SLP Manager or Director</SelectItem>
                  <SelectItem value="community_leader">Community Organization Leader</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="org-interest-field" className="text-[13px] font-semibold text-foreground mb-1.5 block">
                What would you like to learn more about? <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Textarea
                id="org-interest-field"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                placeholder="e.g. staff training on DLD, family workshops, partnership opportunities, bulk book orders…"
                rows={3}
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-[12px] font-bold uppercase tracking-[0.12em]">
              {isSubmitting ? "Sending..." : "Send My Inquiry"}
            </Button>

            <p className="text-[11px] md:text-[12px] text-muted-foreground text-center leading-[1.6]">
              We'll respond personally within 1–2 business days. No spam, ever.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default OrganizationsLeadFormSection;
