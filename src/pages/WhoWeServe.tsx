import Header from "@/components/Header";
import WhoWeServeHero from "@/components/WhoWeServeHero";
import ChoosePathSection from "@/components/ChoosePathSection";
import ShopGlobalCommunity from "@/components/ShopGlobalCommunity";

import EveryChildSection from "@/components/EveryChildSection";
import ResourceBooksSection from "@/components/ResourceBooksSection";
import ChoosePathCTA from "@/components/ChoosePathCTA";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const WhoWeServe = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Who We Serve: Families, SLPs, Educators & Schools"
        description="Practical DLD tools for parents, speech-language pathologists, educators, and schools supporting children with Developmental Language Disorder."
        path="/who-we-serve"
      />
      <Header />
      <main>
        <WhoWeServeHero />
        <ChoosePathSection />
        <ShopGlobalCommunity />
        
        <ResourceBooksSection />
        <EveryChildSection />
        <ChoosePathCTA />
      </main>
      <Footer />
    </div>
  );
};

export default WhoWeServe;
