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
import SongPromoPopup from "@/components/SongPromoPopup";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Empowered DLD",
  url: "https://www.empowereddld.com",
  logo: "https://www.empowereddld.com/favicon.png",
  description: "Explore Developmental Language Disorder (DLD) resources, books, videos, and practical strategies for people with DLD, families, educators, and professionals.",
  sameAs: [
    "https://www.facebook.com/share/g/1GCdxhWtfB/",
    "https://www.instagram.com/empowered.dld/",
    "https://www.youtube.com/@empowereddld"
  ]
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Empowered DLD | Developmental Language Disorder Resources"
        description="Explore Developmental Language Disorder (DLD) resources, books, videos, and practical strategies for people with DLD, families, educators, and professionals."
        ogTitle="Empowered DLD | Understanding DLD. Empowering People."
        ogDescription="Discover stories, resources, practical strategies, and a supportive community dedicated to understanding DLD and empowering people across the lifespan."
        path="/"
        jsonLd={organizationJsonLd}
      />
      <SongPromoPopup />
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
