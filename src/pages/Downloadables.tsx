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
        title="DLD Downloadables & Printables | Empowered DLD"
        description="Printable guides, activities, and worksheets to support a child with Developmental Language Disorder at home, in the classroom, and in therapy."
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
