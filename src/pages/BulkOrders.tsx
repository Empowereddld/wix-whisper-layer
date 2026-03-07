import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BulkOrdersHero from "@/components/BulkOrdersHero";

const BulkOrders = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <BulkOrdersHero />
      </main>
      <Footer />
    </div>
  );
};

export default BulkOrders;
