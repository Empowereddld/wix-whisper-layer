import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ResourcesHero from "@/components/ResourcesHero";
import BrowseByTypeSection from "@/components/BrowseByTypeSection";
import ShopGlobalCommunity from "@/components/ShopGlobalCommunity";
import EveryChildSection from "@/components/EveryChildSection";
import ChoosePathCTA from "@/components/ChoosePathCTA";
import Footer from "@/components/Footer";

const Resources = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.hash === "#blogs" || location.hash === "#blog") {
      navigate("/resources/blog", { replace: true });
    }
  }, [location.hash, navigate]);

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

