import Header from "@/components/Header";
import ForTherapistsHero from "@/components/ForTherapistsHero";
import TherapistsFamiliarSection from "@/components/TherapistsFamiliarSection";
import HowWeSupportTherapistsSection from "@/components/HowWeSupportTherapistsSection";
import WhyTherapistsTrustSection from "@/components/WhyTherapistsTrustSection";
import TherapistsRightPlaceSection from "@/components/TherapistsRightPlaceSection";
import ResourceLibraryCTA from "@/components/ResourceLibraryCTA";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const ForTherapists = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="DLD Resources for Speech-Language Pathologists (SLPs) | Empowered DLD"
        description="Clinical resources, downloadable therapy materials, and professional development for SLPs working with children who have Developmental Language Disorder (DLD)."
        path="/for-therapists"
      />
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
