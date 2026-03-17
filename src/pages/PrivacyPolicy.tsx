import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Privacy Policy — Empowered DLD"
        description="How Empowered DLD collects, uses, and protects your personal information."
        path="/privacy-policy"
      />
      <Header />
      <main className="py-16 md:py-24">
        <div className="container px-6 md:px-8 max-w-[800px] mx-auto">
          <h1 className="text-[32px] md:text-[42px] font-black text-foreground leading-[1.1] mb-8">Privacy Policy</h1>
          <p className="text-[13px] text-muted-foreground mb-8">Last updated: March 17, 2026</p>

          <div className="prose prose-sm max-w-none text-muted-foreground space-y-6 [&_h2]:text-foreground [&_h2]:text-[20px] [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-3 [&_p]:leading-[1.8] [&_ul]:space-y-1 [&_li]:leading-[1.8]">
            <h2>1. Information We Collect</h2>
            <p>When you use our website, sign up for our resource hub, subscribe to our newsletter, or contact us, we may collect the following information:</p>
            <ul className="list-disc pl-6">
              <li>Name and email address</li>
              <li>Professional role (e.g., parent, therapist, educator)</li>
              <li>Organization name (if applicable)</li>
              <li>Country of residence</li>
              <li>Information you provide in contact forms</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6">
              <li>Provide access to our DLD Resource Hub and downloadable materials</li>
              <li>Send newsletters and helpful updates about DLD</li>
              <li>Respond to your inquiries and support requests</li>
              <li>Improve our website, resources, and services</li>
              <li>Process purchases and deliver digital products</li>
            </ul>

            <h2>3. Data Storage and Security</h2>
            <p>Your data is stored securely using industry-standard encryption and access controls. We use trusted third-party services to host our website and manage data. We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>

            <h2>4. Cookies</h2>
            <p>Our website may use essential cookies to ensure proper functionality. We do not use tracking cookies for advertising. If we implement analytics in the future, we will update this policy accordingly.</p>

            <h2>5. Third-Party Services</h2>
            <p>We may use third-party services such as payment processors (for digital product purchases) and email delivery platforms. These services have their own privacy policies and handle your data in accordance with their terms.</p>

            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6">
              <li>Access the personal data we hold about you</li>
              <li>Request correction or deletion of your data</li>
              <li>Unsubscribe from our newsletter at any time</li>
              <li>Request a copy of your data</li>
            </ul>

            <h2>7. Children's Privacy</h2>
            <p>Our website is intended for adults (parents, educators, therapists, and professionals). We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us immediately.</p>

            <h2>8. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. Changes will be posted on this page with an updated revision date.</p>

            <h2>9. Contact Us</h2>
            <p>If you have questions about this privacy policy, please contact us at <a href="mailto:hello@empowereddldparenting.com" className="text-primary hover:underline">hello@empowereddldparenting.com</a>.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
