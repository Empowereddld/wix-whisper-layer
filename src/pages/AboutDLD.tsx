import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutDLDHero from "@/components/AboutDLDHero";
import WhatIsDLDSection from "@/components/WhatIsDLDSection";
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
        title="What is DLD? Symptoms, Signs & Diagnosis | Empowered DLD"
        description="Learn about Developmental Language Disorder (DLD): signs, symptoms, and how DLD is diagnosed. Empowered DLD shares resources and education, not clinical diagnosis."
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
            <span className="text-background text-[20px] md:text-[22px] lg:text-[24px] font-bold tracking-[0.18em]">What is Developmental Language Disorder?
            </span>
          </div>
        </div>
        <WhatIsDLDSection />
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
