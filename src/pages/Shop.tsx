import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShopHero from "@/components/ShopHero";
import ShopBrowseByCategory from "@/components/ShopBrowseByCategory";
import ShopGlobalCommunity from "@/components/ShopGlobalCommunity";
import EveryChildSection from "@/components/EveryChildSection";
import ChoosePathCTA from "@/components/ChoosePathCTA";
import SEOHead from "@/components/SEOHead";

const Shop = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Shop DLD Books & Resources | Empowered DLD"
        description="Books and resources that make a real difference for children with Developmental Language Disorder. Created by an educator and a speech-language pathologist."
        path="/shop"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
        ]}
      />
      <Header />
      <main className="flex-1">
        <ShopHero />
        <ShopBrowseByCategory />
        <ShopGlobalCommunity />
        <EveryChildSection />
        <ChoosePathCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
