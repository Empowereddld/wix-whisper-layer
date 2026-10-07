import { syncToEmailOctopus } from "@/lib/emailoctopus";
import { useState, useEffect } from "react";
import NoIndexHead from "@/components/NoIndexHead";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import empoweredLogo from "@/assets/empowered-logo.webp";

type Role = "parent" | "slp" | "educator" | "school_leader" | "other";

const roleOptions: { value: Role; label: string }[] = [
  { value: "parent", label: "Parent or Caregiver" },
  { value: "slp", label: "Therapist / SLP" },
  { value: "educator", label: "Educator" },
  { value: "school_leader", label: "School Leader / Organization" },
  { value: "other", label: "Other" },
];

const interestOptions = [
  "Understanding DLD",
  "Classroom strategies and accommodations",
  "Activities to support language development",
  "Therapy tools and intervention ideas",
  "Resources to share with schools or professionals",
  "Social communication and friendship support",
  "I'm exploring and not sure where to start",
];

const NEWSLETTER_CHECKBOX_TEXT = "Yes, I'd like practical DLD tips, new resources, and occasional updates from Empowered DLD by email.";
const NEWSLETTER_HELPER_TEXT = "Optional. You can unsubscribe at any time. Your Resource Library access is not affected.";

const SignupRole = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const [selectedRole, setSelectedRole] = useState<Role | undefined>(undefined);
  const [interests, setInterests] = useState<string[]>([]);
  const [resourceWish, setResourceWish] = useState("");
  const [newsletterConsent, setNewsletterConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/hub/signup");
    }
    // If user already completed onboarding (has interests set), go to hub
    if (!authLoading && profile && profile.interests !== null) {
      navigate("/hub");
    }
  }, [user, profile, authLoading, navigate]);

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);

    const storedRef = localStorage.getItem("empowered_ref");
    const updateData: Record<string, any> = {
      interests,
      resource_wish: resourceWish.trim() || null,
    };
    if (selectedRole) updateData.role = selectedRole;
    if (storedRef) {
      updateData.referred_by = storedRef;
      localStorage.removeItem("empowered_ref");
    }

    const { error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", user.id);

    setLoading(false);

    if (error) {
      toast({ title: "Failed to save your info. Please try again.", variant: "destructive" });
      return;
    }

    // Record the newsletter consent choice (yes or no) for the audit trail.
    // A `false` row only means "no opt-in at this moment" — it never revokes
    // an earlier affirmative record. Fire-and-forget: never block onboarding.
    if (user.email) {
      const consentWrite = supabase.from("newsletter_consents").insert({
        user_id: user.id,
        email: user.email.toLowerCase().trim(),
        consented: newsletterConsent,
        source: "resource-library",
        wording_version: "newsletter-consent-v1",
        checkbox_text: NEWSLETTER_CHECKBOX_TEXT,
        helper_text: NEWSLETTER_HELPER_TEXT,
      }).then(({ error: consentError }) => {
        if (consentError) console.warn("Consent record failed:", consentError);
      });

      // If they opted in, add the newsletter tag right away once the consent
      // row is saved (the server only adds "newsletter" when it finds consent).
      if (newsletterConsent) {
        consentWrite.then(() => syncToEmailOctopus({ source: "hub" }));
      }
    }

    // Refresh profile in AuthContext so ProtectedRoute sees updated interests
    // and doesn't bounce the user back to /signup/role.
    await refreshProfile();

    // Fire-and-forget welcome email (server renders from template registry)
    if (user.email) {
      const firstName = profile?.first_name || user.email.split("@")[0];
      supabase.functions.invoke("send-email", {
        body: {
          template: "hub_welcome",
          to: user.email,
          data: { firstName },
        },
      }).catch((e) => console.warn("Welcome email failed:", e));
    }

    navigate("/hub");
  };

  const handleSkip = async () => {
    if (user) {
      // Mark onboarding as complete with empty interests
      await supabase.from("profiles").update({ interests: [] }).eq("id", user.id);
      await refreshProfile();
    }
    navigate("/hub");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <NoIndexHead />
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-midnight" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-thistle/30 to-background flex items-center justify-center p-4">
      <NoIndexHead />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <img src={empoweredLogo} alt="Empowered DLD" className="h-10 mx-auto mb-6" />
          </Link>
          <h1 className="text-3xl font-bold text-midnight mb-2">One last thing...</h1>
          <p className="text-stone-ui">Help us personalize your experience.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* Role Dropdown */}
          <div>
            <Label className="text-midnight font-medium">I am a...</Label>
            <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as Role)}>
              <SelectTrigger className="h-12 mt-1">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((r) => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Interest Checkboxes */}
          <div>
            <Label className="text-midnight font-medium">I'm interested in...</Label>
            <div className="space-y-2.5 mt-2">
              {interestOptions.map((interest) => (
                <label key={interest} className="flex items-center gap-2.5 cursor-pointer group">
                  <Checkbox
                    checked={interests.includes(interest)}
                    onCheckedChange={() => toggleInterest(interest)}
                    className="border-thistle data-[state=checked]:bg-midnight data-[state=checked]:border-midnight"
                  />
                  <span className="text-sm text-foreground group-hover:text-midnight transition-colors">
                    {interest}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Resource Wish */}
          <div>
            <Label className="text-midnight font-medium">I wish there was a resource for...</Label>
            <Textarea
              value={resourceWish}
              onChange={(e) => setResourceWish(e.target.value)}
              placeholder="Your answer might inspire our next resource."
              className="mt-1 min-h-[80px] resize-none"
              maxLength={500}
            />
          </div>

          {/* Optional newsletter consent */}
          <label className="flex items-start gap-2.5 cursor-pointer group">
            <Checkbox
              checked={newsletterConsent}
              onCheckedChange={(v) => setNewsletterConsent(v === true)}
              className="mt-0.5 border-thistle data-[state=checked]:bg-midnight data-[state=checked]:border-midnight"
            />
            <span className="text-sm text-foreground leading-[1.5] group-hover:text-midnight transition-colors">
              {NEWSLETTER_CHECKBOX_TEXT}
              <span className="block text-xs text-stone-ui mt-0.5">{NEWSLETTER_HELPER_TEXT}</span>
            </span>
          </label>

          {/* Submit */}
          <div className="space-y-3">
            <Button
              onClick={handleSubmit}
              className="w-full h-12 bg-midnight hover:bg-midnight/90 text-midnight-foreground font-semibold text-base"
              disabled={loading}
            >
              {loading ? "Saving..." : "Take me to the Resource Library"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupRole;
