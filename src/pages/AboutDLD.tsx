import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutDLDHero from "@/components/AboutDLDHero";
import WhatIsDLDSection from "@/components/WhatIsDLDSection";
import HowCommonSection from "@/components/HowCommonSection";

const AboutDLD = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <AboutDLDHero />
        <div className="bg-foreground py-5 md:py-6 lg:py-7">
          <div className="container px-6 md:px-8">
            <span className="text-background text-[20px] md:text-[22px] lg:text-[24px] font-bold tracking-[0.18em]">What is Developmental Language Disorder?

            </span>
          </div>
        </div>
        <WhatIsDLDSection />
        <HowCommonSection />
      </main>
      <Footer />
    </div>);

};

export default AboutDLD;