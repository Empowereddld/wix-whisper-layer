import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WorkWithUsHero from "@/components/WorkWithUsHero";
import ContactSection from "@/components/ContactSection";

const WorkWithUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <WorkWithUsHero />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default WorkWithUs;
