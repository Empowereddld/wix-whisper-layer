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
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
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
      </main>
      <Footer />
    </div>
  );
};

export default Index;
