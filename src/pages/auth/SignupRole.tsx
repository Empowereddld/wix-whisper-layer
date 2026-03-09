import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { countries } from "@/lib/countries";
import empoweredLogo from "@/assets/empowered-logo.png";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

type Role = "parent" | "slp" | "educator" | "school_leader" | "other";

const roles = [
  { id: "parent" as Role, icon: "👨‍👩‍👧", title: "Parent or Caregiver", description: "Supporting my child with DLD at home" },
  { id: "slp" as Role, icon: "🩺", title: "Therapist / SLP", description: "Working with children with DLD professionally" },
  { id: "educator" as Role, icon: "🏫", title: "Educator", description: "Supporting students with DLD in school" },
  { id: "school_leader" as Role, icon: "🏢", title: "School Leader / Organization", description: "Leading DLD programs or initiatives" },
  { id: "other" as Role, icon: "🌟", title: "Other", description: "Researcher, advocate, or other supporter" },
];

const ageRanges = [
  { value: "0-4", label: "0–4 years" },
  { value: "5-7", label: "5–7 years" },
  { value: "8-10", label: "8–10 years" },
  { value: "11-13", label: "11–13 years" },
  { value: "14+", label: "14+ years" },
  { value: "not_applicable", label: "Not applicable" },
];

const SignupRole = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [country, setCountry] = useState("");
  const [ageRange, setAgeRange] = useState("not_applicable");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/signup");
    }
    if (!authLoading && profile && profile.role !== "parent") {
      navigate("/hub");
    }
  }, [user, profile, authLoading, navigate]);

  const handleContinue = async () => {
    if (!selectedRole || !user) return;

    if (step === 1) {
      setStep(2);
      return;
    }

    setLoading(true);

    const storedRef = localStorage.getItem("empowered_ref");
    const updateData: Record<string, any> = {
      role: selectedRole,
      job_title: jobTitle.trim() || null,
      organization_name: organizationName.trim() || null,
      country: country || null,
      age_range: ageRange || "not_applicable",
    };
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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-midnight" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-thistle/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/">
            <img src={empoweredLogo} alt="Empowered DLD" className="h-10 mx-auto mb-6" />
          </Link>
          <h1 className="text-3xl font-bold text-midnight mb-2">
            {step === 1 ? "Welcome! Tell us about yourself" : "A few more details"}
          </h1>
          <p className="text-stone-ui">
            {step === 1
              ? "This helps us show you the most relevant resources."
              : "Optional — but it helps us personalize your experience."}
          </p>
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className={cn("h-2 w-8 rounded-full transition-colors", step >= 1 ? "bg-coral" : "bg-thistle")} />
            <div className={cn("h-2 w-8 rounded-full transition-colors", step >= 2 ? "bg-coral" : "bg-thistle")} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {step === 1 ? (
            <>
              <p className="text-center text-midnight font-medium text-lg">I am a...</p>
              <div className="space-y-3">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 text-left transition-all duration-200",
                      "hover:border-coral hover:bg-coral/5",
                      selectedRole === role.id ? "border-coral bg-coral/10" : "border-thistle bg-white"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{role.icon}</span>
                      <div>
                        <p className="font-semibold text-midnight">{role.title}</p>
                        <p className="text-sm text-stone-ui">{role.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1 text-sm text-stone-ui hover:text-midnight transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              <div className="space-y-4">
                <div>
                  <Label className="text-midnight font-medium">Job Title / Position</Label>
                  <Input
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Speech-Language Pathologist, Grade 3 Teacher"
                    className="h-12 mt-1"
                    maxLength={100}
                  />
                </div>

                <div>
                  <Label className="text-midnight font-medium">Organization / School Name</Label>
                  <Input
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder="e.g. Sunshine Elementary, Private Practice"
                    className="h-12 mt-1"
                    maxLength={150}
                  />
                </div>

                <div>
                  <Label className="text-midnight font-medium">Country</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger className="h-12 mt-1">
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedRole === "parent" && (
                  <div>
                    <Label className="text-midnight font-medium">Child's Age Range</Label>
                    <Select value={ageRange} onValueChange={setAgeRange}>
                      <SelectTrigger className="h-12 mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ageRanges.map((a) => (
                          <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </>
          )}

          {(step === 1 && selectedRole) && (
            <Button
              onClick={handleContinue}
              className="w-full h-12 bg-coral hover:bg-coral/90 text-white font-semibold text-base animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              Continue →
            </Button>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <Button
                onClick={handleContinue}
                className="w-full h-12 bg-coral hover:bg-coral/90 text-white font-semibold text-base"
                disabled={loading}
              >
                {loading ? "Saving..." : "Take Me to the Resources →"}
              </Button>
              <button
                onClick={() => {
                  // Allow skipping step 2
                  setJobTitle("");
                  setOrganizationName("");
                  handleContinue();
                }}
                className="w-full text-sm text-stone-ui hover:text-midnight transition-colors"
              >
                Skip for now
              </button>
            </div>
          )}

          <p className="text-center text-xs text-stone-ui">You can update this anytime in your settings</p>
        </div>
      </div>
    </div>
  );
};

export default SignupRole;
