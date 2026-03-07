import Header from "@/components/Header";
import DownloadablesHero from "@/components/DownloadablesHero";
import DownloadablesHowItWorks from "@/components/DownloadablesHowItWorks";
import DownloadablesLibraryIntro from "@/components/DownloadablesLibraryIntro";
import InsideDLDResourceHub from "@/components/InsideDLDResourceHub";
import DownloadablesSignupCTA from "@/components/DownloadablesSignupCTA";
import Footer from "@/components/Footer";

const Downloadables = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow">
        <DownloadablesHero />
        <DownloadablesHowItWorks />
        <DownloadablesLibraryIntro />
        <InsideDLDResourceHub />
        <DownloadablesSignupCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Downloadables;
