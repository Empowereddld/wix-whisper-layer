import Header from "@/components/Header";
import DownloadablesHero from "@/components/DownloadablesHero";
import DownloadablesHowItWorks from "@/components/DownloadablesHowItWorks";
import DownloadablesLibraryIntro from "@/components/DownloadablesLibraryIntro";
import InsideDLDResourceHub from "@/components/InsideDLDResourceHub";
import DownloadablesSignupCTA from "@/components/DownloadablesSignupCTA";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const Downloadables = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="Downloadable DLD Resources — Posters, Guides & Activities | Empowered DLD"
        description="Access downloadable resources for Developmental Language Disorder including posters, checklists, handouts, guides, and activities for parents, SLPs, and educators."
        path="/resources/downloadables"
      />
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
