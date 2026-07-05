import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutDLDHero from "@/components/AboutDLDHero";
import WhatIsDLDSection from "@/components/WhatIsDLDSection";
import WhatCausesDLDSection from "@/components/dld/WhatCausesDLDSection";
import SignsAndSymptomsSection from "@/components/dld/SignsAndSymptomsSection";
import DiagnosisSection from "@/components/dld/DiagnosisSection";
import DLDvsSpeechDelaySection from "@/components/dld/DLDvsSpeechDelaySection";
import CureOrOutgrowSection from "@/components/dld/CureOrOutgrowSection";
import TreatmentAndSupportSection from "@/components/dld/TreatmentAndSupportSection";
import LivingWithDLDSection from "@/components/dld/LivingWithDLDSection";
import DLDFaqSection, { faqs } from "@/components/DLDFaqSection";
import ResourceLibraryCTA from "@/components/ResourceLibraryCTA";
import ResourceBooksSection from "@/components/ResourceBooksSection";
import RealityOfDLDSection from "@/components/RealityOfDLDSection";
import NotWholeStoryLamp from "@/components/NotWholeStoryLamp";
import DLDCommunityVideoCarousel from "@/components/DLDCommunityVideoCarousel";
import SEOHead from "@/components/SEOHead";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const AboutDLD = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="What Is DLD? Developmental Language Disorder Explained"
        description="Learn what developmental language disorder (DLD) is, common signs, diagnosis, treatment, and practical support for home and school."
        path="/about-dld"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "About DLD", path: "/about-dld" },
        ]}
        jsonLd={faqJsonLd}
      />
      <Header />
      <main>
        <AboutDLDHero />
        <div className="bg-foreground py-5 md:py-6 lg:py-7">
          <div className="container px-6 md:px-8">
            <span className="text-background text-[20px] md:text-[22px] lg:text-[24px] font-bold tracking-[0.18em]">
              What is Developmental Language Disorder?
            </span>
          </div>
        </div>
        <WhatIsDLDSection />
        <WhatCausesDLDSection />
        <SignsAndSymptomsSection />
        <DiagnosisSection />
        <DLDvsSpeechDelaySection />
        <CureOrOutgrowSection />
        <TreatmentAndSupportSection />
        <LivingWithDLDSection />
        <RealityOfDLDSection />
        <NotWholeStoryLamp />
        <DLDCommunityVideoCarousel />
        <DLDFaqSection />
        <ResourceBooksSection />
        <ResourceLibraryCTA />
      </main>
      <Footer />
    </div>
  );
};

export default AboutDLD;
