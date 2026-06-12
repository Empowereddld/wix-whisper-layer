import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WorkWithUsHero from "@/components/WorkWithUsHero";
import WorkWithUsBrowseSection from "@/components/WorkWithUsBrowseSection";
import WorkWithUsWhoSection from "@/components/WorkWithUsWhoSection";
import WhatMakesUsDifferentSection from "@/components/WhatMakesUsDifferentSection";
import WorkWithUsSocialProof from "@/components/WorkWithUsSocialProof";
import ContactSection from "@/components/ContactSection";
import SEOHead from "@/components/SEOHead";

const WorkWithUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Work With Us: DLD Training & Speaking"
        description="Bring DLD expertise to your school, clinic, or organization. Book Empowered DLD for training, speaking, and consulting on Developmental Language Disorder."
        path="/work-with-us"
      />
      <Header />
      <WorkWithUsHero />
      <WorkWithUsBrowseSection />
      <WorkWithUsWhoSection />
      <WhatMakesUsDifferentSection />
      <WorkWithUsSocialProof />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default WorkWithUs;
