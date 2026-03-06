import Header from "@/components/Header";
import ForTherapistsHero from "@/components/ForTherapistsHero";
import TherapistsFamiliarSection from "@/components/TherapistsFamiliarSection";
import HowWeSupportTherapistsSection from "@/components/HowWeSupportTherapistsSection";
import WhyTherapistsTrustSection from "@/components/WhyTherapistsTrustSection";
import TherapistsRightPlaceSection from "@/components/TherapistsRightPlaceSection";
import ResourceLibraryCTA from "@/components/ResourceLibraryCTA";
import Footer from "@/components/Footer";

const ForTherapists = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ForTherapistsHero />
        <TherapistsFamiliarSection />
        <HowWeSupportTherapistsSection />
        <WhyTherapistsTrustSection />
        <TherapistsRightPlaceSection />
        <ResourceLibraryCTA />
      </main>
      <Footer />
    </div>
  );
};

export default ForTherapists;
