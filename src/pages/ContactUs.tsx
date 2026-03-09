import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";

const ContactUs = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1">
      <ContactSection />
    </main>
    <Footer />
  </div>
);

export default ContactUs;
