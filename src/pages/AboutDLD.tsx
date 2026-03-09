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
        <div className="bg-foreground py-5 md:py-6 lg:py-7">
          <div className="container px-6 md:px-8">
            <span className="text-background text-[20px] md:text-[22px] lg:text-[24px] font-bold uppercase tracking-[0.18em]">WHAT IS DEVELOPMENTAL LANGUAGE DISORDER?

            </span>
          </div>
        </div>
        <WhatIsDLDSection />
      </main>
      <Footer />
    </div>);

};

export default AboutDLD;