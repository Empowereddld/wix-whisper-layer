import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SocialLoginButtons from "@/components/hub/SocialLoginButtons";
import PasswordInput from "@/components/hub/PasswordInput";
import { useToast } from "@/hooks/use-toast";
import empoweredLogo from "@/assets/empowered-logo.webp";

const HubSignup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get("ref");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  // Store ref code for the onboarding flow
  if (refCode) {
    localStorage.setItem("empowered_ref", refCode);
  }

  const validatePassword = (pw: string) => {
    if (pw.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(pw)) return "Password must contain an uppercase letter";
    if (!/[0-9]/.test(pw)) return "Password must contain a number";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.first_name.trim() || !form.email.trim()) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    const pwError = validatePassword(form.password);
    if (pwError) {
      toast({ title: pwError, variant: "destructive" });
      return;
    }
    if (form.password !== form.confirm_password) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        data: {
          first_name: form.first_name.trim(),
          ...(refCode ? { referred_by: refCode } : {}),
        },
        emailRedirectTo: window.location.origin + "/signup/role",
      },
    });
    setLoading(false);

    if (error) {
      toast({ title: "Something went wrong. Please try again.", variant: "destructive" });
      return;
    }
    navigate("/signup/role");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-thistle/30 to-background flex items-center justify-center pt-12 px-4 pb-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <img src={empoweredLogo} alt="Empowered DLD" className="h-10 mx-auto mb-6" />
          </Link>
          <h1 className="text-3xl font-bold text-midnight mb-2">Create Your Free Account</h1>
          <p className="text-stone-ui">Sign up once. Access everything.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <SocialLoginButtons />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-thistle" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-stone-ui font-medium">Or sign up with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="first_name" className="text-midnight font-medium">First Name *</Label>
              <Input id="first_name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} placeholder="Your first name" className="h-12 mt-1" required />
            </div>
            <div>
              <Label htmlFor="email" className="text-midnight font-medium">Email Address *</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="h-12 mt-1" required />
            </div>
            <div>
              <Label htmlFor="password" className="text-midnight font-medium">Password *</Label>
              <div className="mt-1">
                <PasswordInput value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min 8 chars, 1 uppercase, 1 number" id="password" />
              </div>
            </div>
            <div>
              <Label htmlFor="confirm_password" className="text-midnight font-medium">Confirm Password *</Label>
              <div className="mt-1">
                <PasswordInput value={form.confirm_password} onChange={(e) => setForm({ ...form, confirm_password: e.target.value })} placeholder="Confirm your password" id="confirm_password" />
              </div>
            </div>
            <Button type="submit" className="w-full h-12 bg-midnight hover:bg-midnight/90 text-midnight-foreground font-semibold text-base" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-stone-ui">
            Already have an account?{" "}
            <Link to="/hub/login" className="text-hub-lavender font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HubSignup;
