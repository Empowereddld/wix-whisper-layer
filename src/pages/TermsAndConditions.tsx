import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Terms & Conditions — Empowered DLD"
        description="Terms of use for the Empowered DLD website, resources, and digital products."
        path="/terms-and-conditions"
      />
      <Header />
      <main className="py-16 md:py-24">
        <div className="container px-6 md:px-8 max-w-[800px] mx-auto">
          <h1 className="text-[32px] md:text-[42px] font-black text-foreground leading-[1.1] mb-8">Terms & Conditions</h1>
          <p className="text-[13px] text-muted-foreground mb-8">Last updated: March 17, 2026</p>

          <div className="prose prose-sm max-w-none text-muted-foreground space-y-6 [&_h2]:text-foreground [&_h2]:text-[20px] [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-3 [&_p]:leading-[1.8] [&_ul]:space-y-1 [&_li]:leading-[1.8]">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using the Empowered DLD website (www.empowereddld.com), you accept and agree to be bound by these Terms & Conditions. If you do not agree, please do not use our website.</p>

            <h2>2. Use of Our Website</h2>
            <p>You may use our website for lawful purposes only. You agree not to:</p>
            <ul className="list-disc pl-6">
              <li>Use the site in any way that violates applicable laws or regulations</li>
              <li>Attempt to gain unauthorized access to any part of the website</li>
              <li>Use automated tools to scrape or collect data from the website</li>
              <li>Reproduce, distribute, or share our paid resources without authorization</li>
            </ul>

            <h2>3. Intellectual Property</h2>
            <p>All content on this website — including text, images, illustrations, book content, downloadable resources, logos, and design — is the intellectual property of Empowered DLD unless otherwise noted. You may not reproduce, distribute, or create derivative works without our written permission.</p>

            <h2>4. Digital Products & Purchases</h2>
            <p>When you purchase digital resources from our website:</p>
            <ul className="list-disc pl-6">
              <li>You receive a personal, non-transferable license to use the materials</li>
              <li>Resources are for your individual or classroom use only</li>
              <li>Redistribution, resale, or sharing of purchased files is prohibited</li>
              <li>All sales of digital products are final unless otherwise stated</li>
            </ul>

            <h2>5. User Accounts</h2>
            <p>When you create an account on our DLD Resource Hub, you are responsible for maintaining the confidentiality of your login credentials and for all activities under your account.</p>

            <h2>6. Newsletter & Communications</h2>
            <p>By subscribing to our newsletter or providing your email, you consent to receiving periodic emails from Empowered DLD. You can unsubscribe at any time using the link in any email.</p>

            <h2>7. Limitation of Liability</h2>
            <p>Empowered DLD provides educational content and resources for informational purposes. We are not liable for any direct, indirect, or consequential damages arising from your use of our website or resources.</p>

            <h2>8. External Links</h2>
            <p>Our website may contain links to third-party websites (e.g., Amazon for book purchases). We are not responsible for the content or practices of these external sites.</p>

            <h2>9. Changes to Terms</h2>
            <p>We reserve the right to update these terms at any time. Continued use of the website after changes constitutes acceptance of the revised terms.</p>

            <h2>10. Contact</h2>
            <p>For questions about these terms, contact us at <a href="mailto:hello@empowereddldparenting.com" className="text-primary hover:underline">hello@empowereddldparenting.com</a>.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
