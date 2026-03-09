import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PasswordInput from "@/components/hub/PasswordInput";
import { useToast } from "@/hooks/use-toast";
import empoweredLogo from "@/assets/empowered-logo.png";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
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
          <form onSubmit={handleLogin} className="space-y-4">
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
                />
              </div>
              <div className="mt-2 text-right">
                <Link
                  to="/forgot-password"
                  className="text-xs text-coral hover:underline font-medium"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-coral hover:bg-coral/90 text-white font-semibold text-base"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In →"}
            </Button>
          </form>

          <p className="text-center text-sm text-stone-ui">
            Don't have an account?{" "}
            <Link to="/signup" className="text-coral font-medium hover:underline">
              Sign Up Free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
