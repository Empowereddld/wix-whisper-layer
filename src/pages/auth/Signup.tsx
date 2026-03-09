import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = signupSchema.safeParse({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    });

    if (!validation.success) {
      toast({
        title: validation.error.errors[0].message,
        variant: "destructive",
      });
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
        },
        emailRedirectTo: `${window.location.origin}/signup/role`,
      },
    });

    setLoading(false);

    if (error) {
      toast({
        title: error.message,
        variant: "destructive",
      });
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
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-midnight font-medium">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Jane"
                  className="h-12 mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-midnight font-medium">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="h-12 mt-1"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-midnight font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-12 mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-midnight font-medium">
                Password
              </Label>
              <div className="mt-1">
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  placeholder="At least 8 characters"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-midnight font-medium">
                Confirm Password
              </Label>
              <div className="mt-1">
                <PasswordInput
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  id="confirmPassword"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-coral hover:bg-coral/90 text-white font-semibold text-base"
              disabled={loading}
            >
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
            <Link to="/login" className="text-coral font-medium hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
