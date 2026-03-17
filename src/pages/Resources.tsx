import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ResourcesHero from "@/components/ResourcesHero";
import BrowseByTypeSection from "@/components/BrowseByTypeSection";
import ShopGlobalCommunity from "@/components/ShopGlobalCommunity";
import EveryChildSection from "@/components/EveryChildSection";
import ChoosePathCTA from "@/components/ChoosePathCTA";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const Resources = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectLegacyBlogHash = () => {
      const hash = window.location.hash?.toLowerCase();
      if (hash === "#blogs" || hash === "#blog") {
        navigate("/resources/blog", { replace: true });
      }
    };

    redirectLegacyBlogHash();
    window.addEventListener("hashchange", redirectLegacyBlogHash);

    return () => {
      window.removeEventListener("hashchange", redirectLegacyBlogHash);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="DLD Resources — Books, Courses, Podcasts & Downloads | Empowered DLD"
        description="Browse evidence-based Developmental Language Disorder resources including books, free courses, downloadable materials, podcasts, and a blog. Tools for parents, SLPs, and educators."
        path="/resources"
      />
      <Header />
      <main>
        <ResourcesHero />
        <BrowseByTypeSection />
        <ShopGlobalCommunity />
        <EveryChildSection />
        <ChoosePathCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Resources;
