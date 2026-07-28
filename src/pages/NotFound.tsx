import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="Page Not Found — Empowered DLD"
        description="The page you're looking for doesn't exist."
        path={location.pathname}
        noindex
        noCanonical
      />
      <Header />
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="text-center px-6">
          <h1 className="text-[64px] md:text-[80px] font-black text-foreground leading-none mb-4">404</h1>
          <p className="text-[18px] md:text-[22px] text-muted-foreground mb-8 max-w-[460px] mx-auto">
            We couldn't find that page. It may have moved or no longer exists.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center h-12 px-8 bg-deep-purple text-deep-purple-foreground text-[12px] font-bold uppercase tracking-[0.12em] rounded-sm hover:bg-deep-purple/90 transition-colors duration-200"
          >
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
