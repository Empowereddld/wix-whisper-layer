import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutDLDHero from "@/components/AboutDLDHero";

const AboutDLD = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <AboutDLDHero />
      </main>
      <Footer />
    </div>
  );
};

export default AboutDLD;
