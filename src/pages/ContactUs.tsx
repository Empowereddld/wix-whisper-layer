import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import SEOHead from "@/components/SEOHead";

const ContactUs = () => (
  <div className="min-h-screen flex flex-col">
    <SEOHead
      title="Contact Empowered DLD — Get in Touch"
      description="Contact Empowered DLD for questions about Developmental Language Disorder resources, bulk orders, workshops, speaking engagements, or partnership inquiries."
      path="/contact"
    />
    <Header />
    <main className="flex-1">
      <ContactSection />
    </main>
    <Footer />
  </div>
);

export default ContactUs;
