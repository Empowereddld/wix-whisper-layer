import { Link } from "react-router-dom";
import NoIndexHead from "@/components/NoIndexHead";
import { Mail } from "lucide-react";
import empoweredLogo from "@/assets/empowered-logo.webp";

const VerifyEmail = () => {
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
            We've sent a verification link to your email address. Click the link to verify your account and access the Resource Library.
          </p>
          <div className="pt-4 border-t border-thistle">
            <p className="text-sm text-stone-ui">
              Already verified?{" "}
              <Link to="/hub/login" className="text-hub-lavender font-medium hover:underline">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
