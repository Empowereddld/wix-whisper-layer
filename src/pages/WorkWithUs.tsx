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
        title="Work With Us — DLD Workshops, Speaking & Consultation | Empowered DLD"
        description="Book Empowered DLD for workshops, speaking engagements, and consultation on Developmental Language Disorder. Professional development for schools, clinics, and conferences."
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
