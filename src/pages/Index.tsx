import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StatBand from "@/components/StatBand";
import ChoosePathSection from "@/components/ChoosePathSection";
import SupportSection from "@/components/SupportSection";
import BookShowcase from "@/components/BookShowcase";
import TrustSection from "@/components/TrustSection";
import TestimonialBand from "@/components/TestimonialBand";
import NotAloneSection from "@/components/NotAloneSection";
import ContactSection from "@/components/ContactSection";
import ResourceLibraryCTA from "@/components/ResourceLibraryCTA";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Empowered DLD",
  url: "https://wix-whisper-layer.lovable.app",
  logo: "https://wix-whisper-layer.lovable.app/favicon.png",
  description: "Evidence-based resources, books, and community for families and professionals supporting children with Developmental Language Disorder (DLD).",
  sameAs: [
    "https://www.facebook.com/empowereddld",
    "https://www.instagram.com/empowereddld",
    "https://www.youtube.com/@empowereddld"
  ]
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Empowered DLD — Supporting Children with Developmental Language Disorder"
        description="Evidence-based resources, books, and community for families and professionals supporting children with Developmental Language Disorder (DLD). Tools for parents, therapists, educators, and organizations."
        path="/"
        jsonLd={organizationJsonLd}
      />
      <Header />
      <main>
        <HeroSection />
        <StatBand />
        <ChoosePathSection />
        <SupportSection />
        <BookShowcase />
        <TrustSection />
        <TestimonialBand />
        <NotAloneSection />
        <ContactSection />
        <ResourceLibraryCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
