import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShopHero from "@/components/ShopHero";

const Shop = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ShopHero />
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
