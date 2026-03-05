import Header from "@/components/Header";
import WhoWeServeHero from "@/components/WhoWeServeHero";
import ChoosePathSection from "@/components/ChoosePathSection";
import Footer from "@/components/Footer";

const WhoWeServe = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <WhoWeServeHero />
        <ChoosePathSection />
      </main>
      <Footer />
    </div>
  );
};

export default WhoWeServe;
