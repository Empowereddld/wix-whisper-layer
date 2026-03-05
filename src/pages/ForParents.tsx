import Header from "@/components/Header";
import ForParentsHero from "@/components/ForParentsHero";
import DoesSoundFamiliarSection from "@/components/DoesSoundFamiliarSection";
import Footer from "@/components/Footer";

const ForParents = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ForParentsHero />
        <DoesSoundFamiliarSection />
      </main>
      <Footer />
    </div>
  );
};

export default ForParents;
