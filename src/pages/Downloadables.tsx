import Header from "@/components/Header";
import DownloadablesHero from "@/components/DownloadablesHero";
import Footer from "@/components/Footer";

const Downloadables = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <DownloadablesHero />
      </main>
      <Footer />
    </div>
  );
};

export default Downloadables;
