import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SocialLoginButtons from "@/components/hub/SocialLoginButtons";
import PasswordInput from "@/components/hub/PasswordInput";
import { useToast } from "@/hooks/use-toast";
import empoweredLogo from "@/assets/empowered-logo.png";

const HubLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast({ title: "Please enter your email and password", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Invalid email or password", variant: "destructive" });
      return;
    }
    navigate("/hub");
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      toast({ title: "Please enter your email address first", variant: "destructive" });
      return;
    }
    setResetLoading(true);
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: window.location.origin + "/hub/reset-password",
    });
    setResetLoading(false);
    toast({ title: "If an account exists with that email, you'll receive a password reset link." });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-thistle/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <img src={empoweredLogo} alt="Empowered DLD" className="h-10 mx-auto mb-6" />
          </Link>
          <h1 className="text-3xl font-bold text-midnight mb-2">Welcome Back</h1>
          <p className="text-stone-ui">Access your DLD resources</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <SocialLoginButtons />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-thistle" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-stone-ui font-medium">Or log in with email</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-midnight font-medium">Email Address</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="h-12 mt-1" required />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-midnight font-medium">Password</Label>
                <button type="button" onClick={handleForgotPassword} disabled={resetLoading} className="text-xs text-hub-lavender hover:underline font-medium">
                  {resetLoading ? "Sending..." : "Forgot password?"}
                </button>
              </div>
              <div className="mt-1">
                <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} id="password" />
              </div>
            </div>
            <Button type="submit" className="w-full h-12 bg-midnight hover:bg-midnight/90 text-midnight-foreground font-semibold text-base" disabled={loading}>
              {loading ? "Logging in..." : "Access Resources"}
            </Button>
          </form>

          <p className="text-center text-sm text-stone-ui">
            Don't have an account?{" "}
            <Link to="/hub/signup" className="text-hub-lavender font-medium hover:underline">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HubLogin;
