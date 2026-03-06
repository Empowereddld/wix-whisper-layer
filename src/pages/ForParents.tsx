import Header from "@/components/Header";
import ForParentsHero from "@/components/ForParentsHero";
import DoesSoundFamiliarSection from "@/components/DoesSoundFamiliarSection";
import HowWeSupportParentsSection from "@/components/HowWeSupportParentsSection";
import WhyParentsTrustSection from "@/components/WhyParentsTrustSection";
import RightPlaceSection from "@/components/RightPlaceSection";
import ResourceLibraryCTA from "@/components/ResourceLibraryCTA";
import Footer from "@/components/Footer";

const ForParents = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ForParentsHero />
        <DoesSoundFamiliarSection />
        <HowWeSupportParentsSection />
        <WhyParentsTrustSection />
        <RightPlaceSection />
        <ResourceLibraryCTA />
      </main>
      <Footer />
    </div>
  );
};

export default ForParents;
