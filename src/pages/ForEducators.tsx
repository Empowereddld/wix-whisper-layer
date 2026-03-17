import Header from "@/components/Header";
import ForEducatorsHero from "@/components/ForEducatorsHero";
import EducatorsFamiliarSection from "@/components/EducatorsFamiliarSection";
import HowWeSupportSchoolsSection from "@/components/HowWeSupportSchoolsSection";
import WhySchoolsChooseSection from "@/components/WhySchoolsChooseSection";
import ImplementationPackagesSection from "@/components/ImplementationPackagesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import IsThisRightSection from "@/components/IsThisRightSection";
import EducatorsContactCTA from "@/components/EducatorsContactCTA";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const ForEducators = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="DLD Resources for Educators & Schools | Empowered DLD"
        description="Classroom resources, implementation packages, and professional development for educators supporting students with Developmental Language Disorder (DLD) in schools."
        path="/for-educators"
      />
      <Header />
      <main>
        <ForEducatorsHero />
        <EducatorsFamiliarSection />
        <HowWeSupportSchoolsSection />
        <WhySchoolsChooseSection />
        <ImplementationPackagesSection />
        <HowItWorksSection />
        <IsThisRightSection />
        <EducatorsContactCTA />
      </main>
      <Footer />
    </div>
  );
};

export default ForEducators;
