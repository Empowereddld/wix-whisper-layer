import Header from "@/components/Header";
import ForParentsHero from "@/components/ForParentsHero";
import DoesSoundFamiliarSection from "@/components/DoesSoundFamiliarSection";
import HowWeSupportParentsSection from "@/components/HowWeSupportParentsSection";
import WhyParentsTrustSection from "@/components/WhyParentsTrustSection";
import RightPlaceSection from "@/components/RightPlaceSection";
import ResourceLibraryCTA from "@/components/ResourceLibraryCTA";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const ForParents = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="DLD Resources for Parents | Empowered DLD"
        description="Evidence-based resources and support for parents of children with Developmental Language Disorder (DLD). Books, downloadables, free courses, and a supportive community to help your child thrive."
        path="/for-parents"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Who We Serve", path: "/who-we-serve" },
          { name: "For Parents", path: "/for-parents" },
        ]}
      />
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
