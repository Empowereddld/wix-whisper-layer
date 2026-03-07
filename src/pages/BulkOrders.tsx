import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BulkOrdersHero from "@/components/BulkOrdersHero";
import BulkOrdersWhoSection from "@/components/BulkOrdersWhoSection";
import WhyBulkOrderSection from "@/components/WhyBulkOrderSection";
import BulkOrdersHowItWorksSection from "@/components/BulkOrdersHowItWorksSection";
import BulkOrdersCTASection from "@/components/BulkOrdersCTASection";

const BulkOrders = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <BulkOrdersHero />
        <BulkOrdersWhoSection />
        <WhyBulkOrderSection />
        <BulkOrdersHowItWorksSection />
        <BulkOrdersCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default BulkOrders;
