import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BulkOrdersHero from "@/components/BulkOrdersHero";
import BulkOrdersWhoSection from "@/components/BulkOrdersWhoSection";
import WhyBulkOrderSection from "@/components/WhyBulkOrderSection";

const BulkOrders = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <BulkOrdersHero />
        <BulkOrdersWhoSection />
        <WhyBulkOrderSection />
      </main>
      <Footer />
    </div>
  );
};

export default BulkOrders;
