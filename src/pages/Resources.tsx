import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ResourcesHero from "@/components/ResourcesHero";
import BrowseByTypeSection from "@/components/BrowseByTypeSection";
import ShopGlobalCommunity from "@/components/ShopGlobalCommunity";
import EveryChildSection from "@/components/EveryChildSection";
import ChoosePathCTA from "@/components/ChoosePathCTA";
import Footer from "@/components/Footer";

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

