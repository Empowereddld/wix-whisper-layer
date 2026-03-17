import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BulkOrdersHero from "@/components/BulkOrdersHero";
import BulkOrdersWhoSection from "@/components/BulkOrdersWhoSection";
import WhyBulkOrderSection from "@/components/WhyBulkOrderSection";
import BulkOrdersHowItWorksSection from "@/components/BulkOrdersHowItWorksSection";
import BulkOrdersCTASection from "@/components/BulkOrdersCTASection";
import ChoosePathCTA from "@/components/ChoosePathCTA";
import SEOHead from "@/components/SEOHead";

const BulkOrders = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Bulk Orders — DLD Books for Schools & Organizations | Empowered DLD"
        description="Order DLD books in bulk for schools, therapy clinics, and organizations. Discounted pricing on the Living Life with DLD series for classrooms and community programs."
        path="/shop/bulk-orders"
      />
      <Header />
      <main className="flex-1">
        <BulkOrdersHero />
        <BulkOrdersWhoSection />
        <WhyBulkOrderSection />
        <BulkOrdersHowItWorksSection />
        <BulkOrdersCTASection />
        <ChoosePathCTA
          label="EXPLORE BY ROLE"
          heading="Find What's Right for You"
          subheading="Resources and support tailored to your role."
        />
      </main>
      <Footer />
    </div>
  );
};

export default BulkOrders;
