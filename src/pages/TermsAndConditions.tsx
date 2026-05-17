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
          <p className="text-[13px] text-muted-foreground mb-8">Last updated: April 22, 2026</p>

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

            <h2>4. Digital Products & Resource License</h2>
            <p>When you purchase a digital resource (PDF, guide, activity, bundle, or other downloadable file) from Empowered DLD, you are granted a limited, non-exclusive, non-transferable, revocable license to use the resource under the terms below.</p>

            <h2>4.1 Single-User License (Standard Purchase)</h2>
            <p>Unless you have purchased a multi-user or organizational license, every standard purchase grants a <strong>single-user / single-classroom license</strong>. This means:</p>
            <ul className="list-disc pl-6">
              <li><strong>You may</strong> use the resource personally, with your own family, with your own caseload, or with the students in your own single classroom.</li>
              <li><strong>You may</strong> print copies of the resource for use within that single classroom or with your own clients.</li>
              <li><strong>You may not</strong> share the file (or printed copies) with colleagues, co-workers, other classrooms, other clinicians, or any third party.</li>
              <li><strong>You may not</strong> upload the file to any shared drive, learning management system, district platform, intranet, cloud folder, or website where others can access it.</li>
              <li><strong>You may not</strong> resell, sublicense, redistribute, give away, or include the resource (in whole or in part) in any other product, course, or compilation.</li>
              <li><strong>You may not</strong> modify, translate, create derivative works from, or remove copyright notices from the resource.</li>
              <li><strong>You may not</strong> use the resource for any commercial purpose other than your own private practice or classroom instruction.</li>
            </ul>

            <h2>4.2 Multi-User, School, and District Licenses</h2>
            <p>If you intend to use a resource with more than one user, classroom, clinician, school, or district, you must purchase an appropriate multi-user license. Multi-user licensing is available for:</p>
            <ul className="list-disc pl-6">
              <li>Therapy practices and clinical teams</li>
              <li>Schools and school districts</li>
              <li>Hospitals, non-profits, and organizations</li>
              <li>Universities and training programs</li>
            </ul>
            <p>To request a quote for multi-user, school, or district licensing, contact <a href="mailto:hello@empowereddld.com" className="text-primary hover:underline">hello@empowereddld.com</a>.</p>

            <h2>4.3 Copyright</h2>
            <p>All Empowered DLD digital resources are © Empowered DLD. All rights reserved. Copyright notices and watermarks must remain intact on all copies.</p>

            <h2>4.4 License Enforcement</h2>
            <p>We reserve the right to revoke any license, suspend or terminate accounts, and pursue legal remedies (including damages and injunctive relief) for violations of this license. Continued violations may also result in being permanently banned from purchasing future Empowered DLD resources.</p>

            <h2>4.5 Refund Policy</h2>
            <p>Because digital resources are delivered instantly and cannot be "returned," <strong>all sales of digital products are final</strong>. If you experience a technical issue (corrupted file, failed download, duplicate purchase, etc.), contact <a href="mailto:hello@empowereddld.com" className="text-primary hover:underline">hello@empowereddld.com</a> within 14 days of purchase and we will make it right.</p>

            <h2>5. User Accounts</h2>
            <p>When you create an account on our DLD Resource Library, you are responsible for maintaining the confidentiality of your login credentials and for all activities under your account.</p>

            <h2>6. Newsletter & Communications</h2>
            <p>By subscribing to our newsletter or providing your email, you consent to receiving periodic emails from Empowered DLD. You can unsubscribe at any time using the link in any email.</p>

            <h2>7. Limitation of Liability</h2>
            <p>Empowered DLD provides educational content and resources for informational purposes. We are not liable for any direct, indirect, or consequential damages arising from your use of our website or resources.</p>

            <h2>8. External Links</h2>
            <p>Our website may contain links to third-party websites (e.g., Amazon for book purchases). We are not responsible for the content or practices of these external sites.</p>

            <h2>9. Changes to Terms</h2>
            <p>We reserve the right to update these terms at any time. Continued use of the website after changes constitutes acceptance of the revised terms.</p>

            <h2>10. Contact</h2>
            <p>For questions about these terms, contact us at <a href="mailto:hello@empowereddld.com" className="text-primary hover:underline">hello@empowereddld.com</a>.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
