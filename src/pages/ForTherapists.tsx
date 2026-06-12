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
        title="DLD Resources for Speech-Language Therapists"
        description="Evidence-informed books, tools, and materials for your DLD caseload, built in collaboration with speech-language pathologists and educators."
        path="/for-therapists"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Who We Serve", path: "/who-we-serve" },
          { name: "For SLPs", path: "/for-therapists" },
        ]}
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
