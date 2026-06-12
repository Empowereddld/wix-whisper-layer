import Header from "@/components/Header";
import ForOrganizationsHero from "@/components/ForOrganizationsHero";
import OrganizationsAwarenessSection from "@/components/OrganizationsAwarenessSection";
import DLDImpactSection from "@/components/DLDImpactSection";
import OrganizationsStrugglesCTA from "@/components/OrganizationsStrugglesCTA";
import HowWeSupportOrganizationsSection from "@/components/HowWeSupportOrganizationsSection";
import WhyOrganizationsChooseSection from "@/components/WhyOrganizationsChooseSection";
import PartnershipPackagesSection from "@/components/PartnershipPackagesSection";
import IsThisRightForOrgSection from "@/components/IsThisRightForOrgSection";
import ResourceLibraryCTA from "@/components/ResourceLibraryCTA";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const ForOrganizations = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="DLD Partnerships for Organizations & Nonprofits"
        description="Partner with Empowered DLD to bring Developmental Language Disorder awareness, resources, and training to the communities and families you serve."
        path="/for-organizations"
      />
      <Header />
      <main>
        <ForOrganizationsHero />
        <OrganizationsAwarenessSection />
        <DLDImpactSection />
        <OrganizationsStrugglesCTA />
        <HowWeSupportOrganizationsSection />
        <WhyOrganizationsChooseSection />
        <PartnershipPackagesSection />
        <IsThisRightForOrgSection />
        <ResourceLibraryCTA />
      </main>
      <Footer />
    </div>
  );
};

export default ForOrganizations;
