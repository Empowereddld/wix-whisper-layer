import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Disclaimer — Empowered DLD"
        description="Important disclaimers about the educational content and resources provided by Empowered DLD."
        path="/disclaimer"
      />
      <Header />
      <main className="py-16 md:py-24">
        <div className="container px-6 md:px-8 max-w-[800px] mx-auto">
          <h1 className="text-[32px] md:text-[42px] font-black text-foreground leading-[1.1] mb-8">Disclaimer</h1>
          <p className="text-[13px] text-muted-foreground mb-8">Last updated: March 17, 2026</p>

          <div className="prose prose-sm max-w-none text-muted-foreground space-y-6 [&_h2]:text-foreground [&_h2]:text-[20px] [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-3 [&_p]:leading-[1.8] [&_ul]:space-y-1 [&_li]:leading-[1.8]">
            <h2>Educational Purpose Only</h2>
            <p>The content provided on the Empowered DLD website, including articles, blog posts, downloadable resources, books, and course materials, is for educational and informational purposes only. It is not intended to replace professional medical, speech-language pathology, psychological, or legal advice.</p>

            <h2>Not Medical or Therapeutic Advice</h2>
            <p>Empowered DLD is not a healthcare provider. The information on this website should not be used to diagnose or treat Developmental Language Disorder (DLD) or any other condition. Always seek the advice of a qualified speech-language pathologist or other healthcare professional with any questions regarding your child's development or a medical condition.</p>

            <h2>No Guarantee of Results</h2>
            <p>While our resources are evidence-based and created by experienced professionals, every child is unique. We cannot guarantee specific outcomes from using our materials. Results may vary based on individual circumstances, the severity of language challenges, and other factors.</p>

            <h2>Professional Recommendations</h2>
            <p>We strongly encourage families to:</p>
            <ul className="list-disc pl-6">
              <li>Consult with a certified Speech-Language Pathologist (SLP) for assessment and treatment</li>
              <li>Work with your child's school or educational team for individualized support</li>
              <li>Seek professional guidance before making decisions about your child's care based on information from any website</li>
            </ul>

            <h2>External Links</h2>
            <p>This website may contain links to external websites and resources. Empowered DLD is not responsible for the accuracy, content, or availability of information on linked sites. Inclusion of external links does not constitute endorsement.</p>

            <h2>Accuracy of Information</h2>
            <p>We strive to keep all information on this website current and accurate. However, the field of speech-language pathology and DLD research is continually evolving. Information may become outdated. We recommend verifying any critical information with current professional sources.</p>

            <h2>Contact</h2>
            <p>If you have concerns about any content on this website, please contact us at <a href="mailto:hello@empowereddldparenting.com" className="text-primary hover:underline">hello@empowereddldparenting.com</a>.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Disclaimer;
