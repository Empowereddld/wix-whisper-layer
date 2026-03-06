import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import WhoWeServe from "./pages/WhoWeServe";
import ForParents from "./pages/ForParents";
import ForTherapists from "./pages/ForTherapists";
import ForEducators from "./pages/ForEducators";
import ForOrganizations from "./pages/ForOrganizations";
import Resources from "./pages/Resources";
import NotFound from "./pages/NotFound";
import HubSignup from "./pages/hub/HubSignup";
import HubLogin from "./pages/hub/HubLogin";
import VerifyEmail from "./pages/hub/VerifyEmail";
import HubDashboard from "./pages/hub/HubDashboard";
import HubSettings from "./pages/hub/HubSettings";
import ResetPassword from "./pages/hub/ResetPassword";
import HubPreview from "./pages/hub/HubPreview";
import ResourceDetail from "./pages/hub/ResourceDetail";
import ProtectedRoute from "@/components/hub/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/who-we-serve" element={<WhoWeServe />} />
            <Route path="/for-parents" element={<ForParents />} />
            <Route path="/for-therapists" element={<ForTherapists />} />
            <Route path="/for-educators" element={<ForEducators />} />
            <Route path="/for-organizations" element={<ForOrganizations />} />
            <Route path="/hub/signup" element={<HubSignup />} />
            <Route path="/hub/login" element={<HubLogin />} />
            <Route path="/hub/verify-email" element={<VerifyEmail />} />
            <Route path="/hub/reset-password" element={<ResetPassword />} />
            <Route path="/hub/preview" element={<HubPreview />} />
            <Route path="/hub" element={<ProtectedRoute><HubDashboard /></ProtectedRoute>} />
            <Route path="/hub/resource/:id" element={<ProtectedRoute><ResourceDetail /></ProtectedRoute>} />
            <Route path="/hub/settings" element={<ProtectedRoute><HubSettings /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
