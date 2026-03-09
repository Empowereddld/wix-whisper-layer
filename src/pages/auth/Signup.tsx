import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PasswordInput from "@/components/hub/PasswordInput";
import { useToast } from "@/hooks/use-toast";
import empoweredLogo from "@/assets/empowered-logo.png";
import { z } from "zod";

const signupSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50),
  lastName: z.string().trim().min(1, "Last name is required").max(50),
  email: z.string().trim().email("Please enter a valid email").max(255),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const refCode = searchParams.get("ref");

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    // Store ref code in localStorage so we can capture it after redirect
    if (refCode) localStorage.setItem("empowered_ref", refCode);
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/signup/role",
    });
    if (error) {
      toast({ title: "Google sign-in failed. Please try again.", variant: "destructive" });
    }
    setGoogleLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = signupSchema.safeParse({ firstName, lastName, email, password, confirmPassword });
    if (!validation.success) {
      toast({ title: validation.error.errors[0].message, variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          ...(refCode ? { referred_by: refCode } : {}),
        },
        emailRedirectTo: `${window.location.origin}/signup/role`,
      },
    });
    setLoading(false);

    if (error) {
      toast({ title: error.message, variant: "destructive" });
      return;
    }
    navigate("/hub/verify-email");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-thistle/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <img src={empoweredLogo} alt="Empowered DLD" className="h-10 mx-auto mb-6" />
          </Link>
          <h1 className="text-3xl font-bold text-midnight mb-2">Create Your Free Account</h1>
          <p className="text-stone-ui">
            Join thousands of parents, therapists, and educators supporting children with DLD.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* Google Login */}
          <Button
            variant="outline"
            className="w-full h-12 text-sm font-medium border-2 hover:bg-thistle/30"
            onClick={handleGoogleSignup}
            disabled={googleLoading}
          >
            <GoogleIcon />
            {googleLoading ? "Connecting..." : "Continue with Google"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-thistle" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-stone-ui font-medium">or</span>
            </div>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-midnight font-medium">First Name</Label>
                <Input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Jane" className="h-12 mt-1" required />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-midnight font-medium">Last Name</Label>
                <Input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" className="h-12 mt-1" required />
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="text-midnight font-medium">Email Address</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="h-12 mt-1" required />
            </div>
            <div>
              <Label htmlFor="password" className="text-midnight font-medium">Password</Label>
              <div className="mt-1">
                <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} id="password" placeholder="At least 8 characters" />
              </div>
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-midnight font-medium">Confirm Password</Label>
              <div className="mt-1">
                <PasswordInput value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} id="confirmPassword" placeholder="Confirm your password" />
              </div>
            </div>
            <Button type="submit" className="w-full h-12 bg-coral hover:bg-coral/90 text-white font-semibold text-base" disabled={loading}>
              {loading ? "Creating Account..." : "Create My Account →"}
            </Button>
          </form>

          <div className="flex items-center justify-center gap-4 text-xs text-stone-ui">
            <span>✦ 100% Free</span>
            <span>✦ No credit card</span>
            <span>✦ Cancel anytime</span>
          </div>

          <p className="text-center text-sm text-stone-ui">
            Already have an account?{" "}
            <Link to="/login" className="text-coral font-medium hover:underline">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
