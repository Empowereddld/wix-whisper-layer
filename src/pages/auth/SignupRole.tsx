import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import empoweredLogo from "@/assets/empowered-logo.png";
import { cn } from "@/lib/utils";

type Role = "parent" | "slp" | "educator";

const roles = [
  { id: "parent" as Role, icon: "👨‍👩‍👧", title: "Parent or Caregiver", description: "Supporting my child with DLD at home" },
  { id: "slp" as Role, icon: "🩺", title: "Therapist", description: "Working with children with DLD professionally" },
  { id: "educator" as Role, icon: "🏫", title: "Educator", description: "Supporting students with DLD in school" },
];

const SignupRole = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, loading: authLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/signup");
    }
    // If user already has a non-default role, skip this step
    if (!authLoading && profile && profile.role !== "parent") {
      navigate("/hub");
    }
  }, [user, profile, authLoading, navigate]);

  const handleContinue = async () => {
    if (!selectedRole || !user) return;

    setLoading(true);

    // Capture stored referral code from Google OAuth flow
    const storedRef = localStorage.getItem("empowered_ref");
    const updateData: Record<string, any> = { role: selectedRole };
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
      toast({ title: "Failed to save your selection. Please try again.", variant: "destructive" });
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
          <h1 className="text-3xl font-bold text-midnight mb-2">Welcome! One quick question...</h1>
          <p className="text-stone-ui">This helps us show you the most relevant resources.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
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

          {selectedRole && (
            <Button
              onClick={handleContinue}
              className="w-full h-12 bg-coral hover:bg-coral/90 text-white font-semibold text-base animate-in fade-in slide-in-from-bottom-2 duration-300"
              disabled={loading}
            >
              {loading ? "Saving..." : "Take Me to the Resources →"}
            </Button>
          )}

          <p className="text-center text-xs text-stone-ui">You can update this anytime in your profile</p>
        </div>
      </div>
    </div>
  );
};

export default SignupRole;
