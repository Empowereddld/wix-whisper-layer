import Header from "@/components/Header";
import WhoWeServeHero from "@/components/WhoWeServeHero";
import ChoosePathSection from "@/components/ChoosePathSection";
import ShopGlobalCommunity from "@/components/ShopGlobalCommunity";
import RealityOfDLDSection from "@/components/RealityOfDLDSection";
import EveryChildSection from "@/components/EveryChildSection";
import ChoosePathCTA from "@/components/ChoosePathCTA";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const WhoWeServe = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Who We Serve — Parents, Therapists, Educators & Organizations | Empowered DLD"
        description="Empowered DLD supports parents, speech-language pathologists, educators, and organizations helping children with Developmental Language Disorder. Find the right resources for your role."
        path="/who-we-serve"
      />
      <Header />
      <main>
        <WhoWeServeHero />
        <ChoosePathSection />
        <ShopGlobalCommunity />
        <RealityOfDLDSection />
        <EveryChildSection />
        <ChoosePathCTA />
      </main>
      <Footer />
    </div>
  );
};

export default WhoWeServe;
