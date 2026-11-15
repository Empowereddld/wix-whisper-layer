import { authPath, rememberResourceReturn } from "@/lib/resourceReturn";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-midnight" />
      </div>
    );
  }

  if (!session) {
    const destination = location.pathname + location.search;
    rememberResourceReturn(destination);
    return <Navigate to={authPath("/hub/login", destination)} replace />;
  }

  // Redirect new users who haven't completed onboarding
  if (profile && profile.interests === null && location.pathname !== "/signup/role") {
    const destination = location.pathname + location.search;
    rememberResourceReturn(destination);
    return <Navigate to={authPath("/signup/role", destination)} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
