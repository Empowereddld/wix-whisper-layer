import Header from "@/components/Header";
import DownloadablesHero from "@/components/DownloadablesHero";
import StatBand from "@/components/StatBand";
import DownloadablesHowItWorks from "@/components/DownloadablesHowItWorks";
import InsideDLDResourceHub from "@/components/InsideDLDResourceHub";
import Footer from "@/components/Footer";

const Downloadables = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <DownloadablesHero />
        <StatBand />
        <DownloadablesHowItWorks />
        <InsideDLDResourceHub />
      </main>
      <Footer />
    </div>
  );
};

export default Downloadables;
