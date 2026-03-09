import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WorkWithUsHero from "@/components/WorkWithUsHero";
import WorkWithUsBrowseSection from "@/components/WorkWithUsBrowseSection";
import DoesSoundFamiliarSection from "@/components/DoesSoundFamiliarSection";
import WhatMakesUsDifferentSection from "@/components/WhatMakesUsDifferentSection";
import WorkWithUsSocialProof from "@/components/WorkWithUsSocialProof";
import ContactSection from "@/components/ContactSection";

const WorkWithUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <WorkWithUsHero />
      <WorkWithUsBrowseSection />
      <DoesSoundFamiliarSection />
      <WhatMakesUsDifferentSection />
      <WorkWithUsSocialProof />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default WorkWithUs;
