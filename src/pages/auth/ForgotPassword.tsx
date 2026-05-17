import { useState } from "react";
import NoIndexHead from "@/components/NoIndexHead";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import empoweredLogo from "@/assets/empowered-logo.webp";
import { ArrowLeft, Mail } from "lucide-react";

const ForgotPassword = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast({ title: "Please enter your email address", variant: "destructive" });
      return;
    }

    setLoading(true);

    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/hub/reset-password`,
    });

    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-thistle/30 to-background flex items-center justify-center p-4">
        <NoIndexHead />
        <div className="w-full max-w-md text-center">
          <Link to="/">
            <img src={empoweredLogo} alt="Empowered DLD" className="h-10 mx-auto mb-8" />
          </Link>

          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <div className="w-16 h-16 bg-thistle rounded-full flex items-center justify-center mx-auto">
              <Mail className="h-8 w-8 text-midnight" />
            </div>
            <h1 className="text-2xl font-bold text-midnight">Check Your Email</h1>
            <p className="text-stone-ui leading-relaxed">
              If an account exists with <strong>{email}</strong>, you'll receive a password reset link shortly.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-coral font-medium hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Log In
            </Link>
          </div>
        </div>
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
          <h1 className="text-3xl font-bold text-midnight mb-2">Reset Your Password</h1>
          <p className="text-stone-ui">Enter your email and we'll send you a reset link.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <Button
              type="submit"
              className="w-full h-12 bg-coral hover:bg-coral/90 text-white font-semibold text-base"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link →"}
            </Button>
          </form>

          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-sm text-coral font-medium hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
