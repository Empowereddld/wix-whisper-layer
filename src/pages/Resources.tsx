import Header from "@/components/Header";
import ResourcesHero from "@/components/ResourcesHero";
import BrowseByTypeSection from "@/components/BrowseByTypeSection";
import ShopGlobalCommunity from "@/components/ShopGlobalCommunity";
import EveryChildSection from "@/components/EveryChildSection";
import ChoosePathCTA from "@/components/ChoosePathCTA";
import Footer from "@/components/Footer";

const Resources = () => {
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
