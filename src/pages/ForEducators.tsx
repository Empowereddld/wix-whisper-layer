import Header from "@/components/Header";
import ForEducatorsHero from "@/components/ForEducatorsHero";
import EducatorsFamiliarSection from "@/components/EducatorsFamiliarSection";
import HowWeSupportSchoolsSection from "@/components/HowWeSupportSchoolsSection";
import EducatorsDLDAwarenessCTA from "@/components/EducatorsDLDAwarenessCTA";
import WhySchoolsChooseSection from "@/components/WhySchoolsChooseSection";
import ImplementationPackagesSection from "@/components/ImplementationPackagesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import IsThisRightSection from "@/components/IsThisRightSection";
import EducatorsContactCTA from "@/components/EducatorsContactCTA";
import Footer from "@/components/Footer";

const ForEducators = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ForEducatorsHero />
        <EducatorsFamiliarSection />
        <HowWeSupportSchoolsSection />
        <EducatorsDLDAwarenessCTA />
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
