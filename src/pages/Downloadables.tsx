import Header from "@/components/Header";
import DownloadablesHero from "@/components/DownloadablesHero";
import DownloadablesHowItWorks from "@/components/DownloadablesHowItWorks";
import InsideDLDResourceHub from "@/components/InsideDLDResourceHub";
import Footer from "@/components/Footer";

const Downloadables = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <DownloadablesHero />
        <DownloadablesHowItWorks />
        <InsideDLDResourceHub />
      </main>
      <Footer />
    </div>
  );
};

export default Downloadables;
