import { useState, useEffect } from "react";
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

const SignupRole = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, loading: authLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<Role | undefined>(undefined);
  const [interests, setInterests] = useState<string[]>([]);
  const [resourceWish, setResourceWish] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/hub/signup");
    }
    // If user already completed onboarding, go to hub
    if (!authLoading && profile && profile.role !== "parent") {
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

    navigate("/hub");
  };

  const handleSkip = () => {
    navigate("/hub");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-midnight" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-thistle/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <img src={empoweredLogo} alt="Empowered DLD" className="h-48 mx-auto" />
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

          {/* Submit */}
          <div className="space-y-3">
            <Button
              onClick={handleSubmit}
              className="w-full h-12 bg-midnight hover:bg-midnight/90 text-midnight-foreground font-semibold text-base"
              disabled={loading}
            >
              {loading ? "Saving..." : "Take me to the Resource Hub"}
            </Button>
            <button
              onClick={handleSkip}
              className="w-full text-sm text-stone-ui hover:text-midnight transition-colors"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupRole;
