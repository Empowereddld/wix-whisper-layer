import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutDLDHero from "@/components/AboutDLDHero";
import WhatIsDLDSection from "@/components/WhatIsDLDSection";

const AboutDLD = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <AboutDLDHero />
        <WhatIsDLDSection />
      </main>
      <Footer />
    </div>
  );
};

export default AboutDLD;
