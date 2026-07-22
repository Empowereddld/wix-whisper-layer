import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import MerchHero from "@/components/merch/MerchHero";
import MerchMissionStrip from "@/components/merch/MerchMissionStrip";
import MerchProductGrid from "@/components/merch/MerchProductGrid";
import MerchFaq from "@/components/merch/MerchFaq";
import MerchCartDrawer from "@/components/merch/MerchCartDrawer";
import MerchCartButton from "@/components/merch/MerchCartButton";
import ChoosePathCTA from "@/components/ChoosePathCTA";

const ShopMerch = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Shop DLD Merch: Tees, Water Bottles & Totes | Empowered DLD"
        description="Shop DLD awareness merch: soft tees, stainless steel water bottles, and canvas totes. Printed on demand and shipped worldwide."
        path="/shop/merch"
        noindex
      />
      <Header />
      <main className="flex-1">
        <MerchHero />
        <MerchMissionStrip />
        <MerchProductGrid />
        <MerchFaq />
        <ChoosePathCTA />
      </main>
      <Footer />
      <MerchCartDrawer />
      <MerchCartButton />
    </div>
  );
};

export default ShopMerch;
