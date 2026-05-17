import { useState } from "react";
import NoIndexHead from "@/components/NoIndexHead";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PasswordInput from "@/components/hub/PasswordInput";
import { useToast } from "@/hooks/use-toast";
import empoweredLogo from "@/assets/empowered-logo.webp";

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/hub",
    });
    if (error) {
      toast({ title: "Google sign-in failed. Please try again.", variant: "destructive" });
    }
    setGoogleLoading(false);
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-thistle/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <img src={empoweredLogo} alt="Empowered DLD" className="h-10 mx-auto mb-6" />
          </Link>
          <h1 className="text-3xl font-bold text-midnight mb-2">Welcome Back</h1>
          <p className="text-stone-ui">Log in to access your free DLD resources.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* Google Login */}
          <Button
            variant="outline"
            className="w-full h-12 text-sm font-medium border-2 hover:bg-thistle/30"
            onClick={handleGoogleLogin}
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

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-midnight font-medium">Email Address</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="h-12 mt-1" required />
            </div>
            <div>
              <Label htmlFor="password" className="text-midnight font-medium">Password</Label>
              <div className="mt-1">
                <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} id="password" />
              </div>
              <div className="mt-2 text-right">
                <Link to="/forgot-password" className="text-xs text-coral hover:underline font-medium">Forgot your password?</Link>
              </div>
            </div>
            <Button type="submit" className="w-full h-12 bg-coral hover:bg-coral/90 text-white font-semibold text-base" disabled={loading}>
              {loading ? "Logging in..." : "Log In →"}
            </Button>
          </form>

          <p className="text-center text-sm text-stone-ui">
            Don't have an account?{" "}
            <Link to="/signup" className="text-coral font-medium hover:underline">Sign Up Free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
