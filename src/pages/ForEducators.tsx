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
        title="DLD Support & Resources for Educators | Empowered DLD"
        description="Help students with Developmental Language Disorder thrive in your classroom. Practical DLD strategies, training, and resources for teachers and schools."
        path="/for-educators"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Who We Serve", path: "/who-we-serve" },
          { name: "For Educators", path: "/for-educators" },
        ]}
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
