import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OrganizationsLeadFormSection = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [orgName, setOrgName] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Frontend-only for now
    console.log({ name, email, orgName, role });
  };

  return (
    <section className="py-10 md:py-16 lg:py-[120px] bg-muted">
      <div className="container px-6 md:px-8">
        <div className="max-w-[600px] mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-[28px] md:text-[38px] lg:text-[46px] font-black text-foreground leading-[1.1] mb-3">
              Get Our Free DLD Recognition Guide
            </h2>
            <p className="text-[13px] md:text-[14px] lg:text-[16px] text-muted-foreground leading-[1.7]">
              Not ready to book yet? Start here. Download our free guide to help your team recognize the early signs of DLD in the children you serve.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="org-name-field" className="text-[13px] font-semibold text-foreground mb-1.5 block">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="org-name-field"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
              />
            </div>

            <div>
              <Label htmlFor="org-email-field" className="text-[13px] font-semibold text-foreground mb-1.5 block">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="org-email-field"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@organization.com"
              />
            </div>

            <div>
              <Label htmlFor="org-org-name-field" className="text-[13px] font-semibold text-foreground mb-1.5 block">
                Organization Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="org-org-name-field"
                required
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Your organization"
              />
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

            <Button
              type="submit"
              className="w-full h-12 text-[12px] font-bold uppercase tracking-[0.12em]"
            >
              Download Free Guide
            </Button>

            <p className="text-[11px] md:text-[12px] text-muted-foreground text-center leading-[1.6]">
              You'll also get helpful tips and updates from Empowered DLD. Unsubscribe anytime.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default OrganizationsLeadFormSection;
