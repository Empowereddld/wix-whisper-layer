import Header from "@/components/Header";
import WhoWeServeHero from "@/components/WhoWeServeHero";
import ChoosePathSection from "@/components/ChoosePathSection";
import RealityOfDLDSection from "@/components/RealityOfDLDSection";
import EveryChildSection from "@/components/EveryChildSection";
import ChoosePathCTA from "@/components/ChoosePathCTA";
import Footer from "@/components/Footer";

const WhoWeServe = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <WhoWeServeHero />
        <ChoosePathSection />
        <RealityOfDLDSection />
        <EveryChildSection />
        <ChoosePathCTA />
      </main>
      <Footer />
    </div>
  );
};

export default WhoWeServe;
