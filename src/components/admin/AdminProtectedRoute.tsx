import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminCheck } from "@/hooks/useAdminCheck";

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminCheck(user?.id);

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/hub/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/hub" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
