import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ScrollToTop from "./components/ScrollToTop";

// Eagerly loaded (main public pages)
import Index from "./pages/Index";
import WhoWeServe from "./pages/WhoWeServe";
import ForParents from "./pages/ForParents";
import ForTherapists from "./pages/ForTherapists";
import ForEducators from "./pages/ForEducators";
import ForOrganizations from "./pages/ForOrganizations";
import Resources from "./pages/Resources";
import Shop from "./pages/Shop";
import Books from "./pages/Books";
import BulkOrders from "./pages/BulkOrders";
import WorkWithUs from "./pages/WorkWithUs";
import AboutDLD from "./pages/AboutDLD";
import ContactUs from "./pages/ContactUs";
import NotFound from "./pages/NotFound";

// Lazy-loaded: Blog
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));

// Lazy-loaded: Resources sub-pages
const Podcasts = lazy(() => import("./pages/Podcasts"));
const FreeCourse = lazy(() => import("./pages/FreeCourse"));
const Downloadables = lazy(() => import("./pages/Downloadables"));
const EducationalApp = lazy(() => import("./pages/EducationalApp"));

// Lazy-loaded: Auth
const Signup = lazy(() => import("./pages/auth/Signup"));
const SignupRole = lazy(() => import("./pages/auth/SignupRole"));
const Login = lazy(() => import("./pages/auth/Login"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));

// Lazy-loaded: Hub
const HubSignup = lazy(() => import("./pages/hub/HubSignup"));
const HubLogin = lazy(() => import("./pages/hub/HubLogin"));
const VerifyEmail = lazy(() => import("./pages/hub/VerifyEmail"));
const HubDashboard = lazy(() => import("./pages/hub/HubDashboard"));
const HubSettings = lazy(() => import("./pages/hub/HubSettings"));
const ResetPassword = lazy(() => import("./pages/hub/ResetPassword"));
const HubPreview = lazy(() => import("./pages/hub/HubPreview"));
const ResourceDetail = lazy(() => import("./pages/hub/ResourceDetail"));
const PaymentSuccess = lazy(() => import("./pages/hub/PaymentSuccess"));
const IEPGoalBuilder = lazy(() => import("./pages/hub/IEPGoalBuilder"));

// Lazy-loaded: Admin
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminResources = lazy(() => import("./pages/admin/AdminResources"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog"));
const AdminPurchases = lazy(() => import("./pages/admin/AdminPurchases"));
const AdminDiscounts = lazy(() => import("./pages/admin/AdminDiscounts"));
const AdminEmails = lazy(() => import("./pages/admin/AdminEmails"));
const AdminNewsletter = lazy(() => import("./pages/admin/AdminNewsletter"));
const AdminAuditLog = lazy(() => import("./pages/admin/AdminAuditLog"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminWaitlist = lazy(() => import("./pages/admin/AdminWaitlist"));
const AdminResourceRequests = lazy(() => import("./pages/admin/AdminResourceRequests"));
const AdminReferrals = lazy(() => import("./pages/admin/AdminReferrals"));
const AdminStoryBuilders = lazy(() => import("./pages/AdminStoryBuilders"));
const AdminWaitlistGuide = lazy(() => import("./pages/AdminWaitlistGuide"));

// Lazy-loaded: Legal & misc
const StoryBuilders = lazy(() => import("./pages/StoryBuilders"));
const StoryProsDashboard = lazy(() => import("./pages/StoryProsDashboard"));
const VerifySuccess = lazy(() => import("./pages/VerifySuccess"));
const WaitlistUserGuide = lazy(() => import("./pages/WaitlistUserGuide"));
const EarlySupportersWall = lazy(() => import("./pages/EarlySupportersWall"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe"));

// Lazy-loaded: Protected route wrappers
const ProtectedRoute = lazy(() => import("@/components/hub/ProtectedRoute"));
const AdminProtectedRoute = lazy(() => import("@/components/admin/AdminProtectedRoute"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <Suspense fallback={<div className="min-h-screen" />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/who-we-serve" element={<WhoWeServe />} />
              <Route path="/for-parents" element={<ForParents />} />
              <Route path="/for-therapists" element={<ForTherapists />} />
              <Route path="/for-educators" element={<ForEducators />} />
              <Route path="/for-organizations" element={<ForOrganizations />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/resources/podcasts" element={<Podcasts />} />
              <Route path="/resources/free-course" element={<FreeCourse />} />
              <Route path="/resources/downloadables" element={<Downloadables />} />
              <Route path="/resources/blog" element={<Blog />} />
              <Route path="/resources/blog/:slug" element={<BlogPost />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/books" element={<Books />} />
              <Route path="/shop/bulk-orders" element={<BulkOrders />} />
              <Route path="/shop/educational-app" element={<EducationalApp />} />
              <Route path="/work-with-us" element={<WorkWithUs />} />
              <Route path="/about-dld" element={<AboutDLD />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/storypros" element={<StoryBuilders />} />
              <Route path="/storypros/dashboard" element={<StoryProsDashboard />} />
              <Route path="/storypros/verified" element={<VerifySuccess />} />
              <Route path="/storybuilders" element={<Navigate to="/storypros" replace />} />
              <Route path="/storybuilders/dashboard" element={<Navigate to="/storypros/dashboard" replace />} />
              <Route path="/storypros/guide" element={<WaitlistUserGuide />} />
              <Route path="/storypros/supporters" element={<EarlySupportersWall />} />
              <Route path="/storybuilders/guide" element={<Navigate to="/storypros/guide" replace />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/unsubscribe" element={<Unsubscribe />} />
              <Route path="/signup/role" element={<SignupRole />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/hub/signup" element={<HubSignup />} />
              <Route path="/hub/login" element={<HubLogin />} />
              <Route path="/hub/verify-email" element={<VerifyEmail />} />
              <Route path="/hub/reset-password" element={<ResetPassword />} />
              
              <Route path="/hub/preview" element={<HubPreview />} />
              <Route path="/hub/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
              <Route path="/hub" element={<ProtectedRoute><HubDashboard /></ProtectedRoute>} />
              <Route path="/hub/resource/:id" element={<ProtectedRoute><ResourceDetail /></ProtectedRoute>} />
              <Route path="/hub/settings" element={<ProtectedRoute><HubSettings /></ProtectedRoute>} />
              <Route path="/iep-goal-builder" element={<ProtectedRoute><IEPGoalBuilder /></ProtectedRoute>} />
              {/* Admin routes */}
              <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
              <Route path="/admin/resources" element={<AdminProtectedRoute><AdminResources /></AdminProtectedRoute>} />
              <Route path="/admin/users" element={<AdminProtectedRoute><AdminUsers /></AdminProtectedRoute>} />
              <Route path="/admin/analytics" element={<AdminProtectedRoute><AdminAnalytics /></AdminProtectedRoute>} />
              <Route path="/admin/blog" element={<AdminProtectedRoute><AdminBlog /></AdminProtectedRoute>} />
              <Route path="/admin/purchases" element={<AdminProtectedRoute><AdminPurchases /></AdminProtectedRoute>} />
              <Route path="/admin/discounts" element={<AdminProtectedRoute><AdminDiscounts /></AdminProtectedRoute>} />
              <Route path="/admin/products" element={<AdminProtectedRoute><AdminProducts /></AdminProtectedRoute>} />
              <Route path="/admin/waitlist" element={<AdminProtectedRoute><AdminWaitlist /></AdminProtectedRoute>} />
              <Route path="/admin/resource-requests" element={<AdminProtectedRoute><AdminResourceRequests /></AdminProtectedRoute>} />
              <Route path="/admin/referrals" element={<AdminProtectedRoute><AdminReferrals /></AdminProtectedRoute>} />
              <Route path="/admin/emails" element={<AdminProtectedRoute><AdminEmails /></AdminProtectedRoute>} />
              <Route path="/admin/newsletter" element={<AdminProtectedRoute><AdminNewsletter /></AdminProtectedRoute>} />
              <Route path="/admin/audit" element={<AdminProtectedRoute><AdminAuditLog /></AdminProtectedRoute>} />
              <Route path="/admin/storypros" element={<AdminProtectedRoute><AdminStoryBuilders /></AdminProtectedRoute>} />
              <Route path="/admin/storybuilders" element={<Navigate to="/admin/storypros" replace />} />
              <Route path="/admin/waitlist-guide" element={<AdminProtectedRoute><AdminWaitlistGuide /></AdminProtectedRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
