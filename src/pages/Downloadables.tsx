import Header from "@/components/Header";
import DownloadablesHero from "@/components/DownloadablesHero";
import DownloadablesHowItWorks from "@/components/DownloadablesHowItWorks";
import Footer from "@/components/Footer";

const Downloadables = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <DownloadablesHero />
        <DownloadablesHowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default Downloadables;
