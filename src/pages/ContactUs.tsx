import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import SEOHead from "@/components/SEOHead";

const ContactUs = () => (
  <div className="min-h-screen flex flex-col">
    <SEOHead
      title="Contact Us | Empowered DLD"
      description="Questions about Developmental Language Disorder, our books, or working together? Get in touch with the Empowered DLD team. We would love to hear from you."
      path="/contact"
    />
    <Header />
    <main className="flex-1">
      <h1 className="sr-only">Contact Empowered DLD</h1>
      <ContactSection />
    </main>
    <Footer />
  </div>
);

export default ContactUs;
