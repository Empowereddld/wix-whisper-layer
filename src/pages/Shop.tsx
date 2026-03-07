import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShopHero from "@/components/ShopHero";
import ShopBrowseByCategory from "@/components/ShopBrowseByCategory";
import ShopGlobalCommunity from "@/components/ShopGlobalCommunity";
import EveryChildSection from "@/components/EveryChildSection";
import ChoosePathCTA from "@/components/ChoosePathCTA";

const Shop = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ShopHero />
        <ShopBrowseByCategory />
        <ShopGlobalCommunity />
        <EveryChildSection />
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
