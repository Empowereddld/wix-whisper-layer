import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import BlogFAQAccordion from "@/components/BlogFAQAccordion";
import cover from "@/assets/book-parent-guidebook.webp";
import founders from "@/assets/founders-circle.webp";
import page4 from "@/assets/guidebook-p4.webp";
import page6 from "@/assets/guidebook-p6.webp";

const PRICE = "$9.99 USD";
const RESOURCE_ID = "1d54403b-1185-46dd-8307-b918a731e580";

const PAGES = [
  { src: page4, title: "Celebrate their strengths", text: "Start with what your child is good at, so DLD is never the whole story.", alt: "Guidebook page 4, Celebrating Your Child's Talents, with prompts for noticing your child's strengths" },
  { src: page6, title: "Explain DLD together", text: "Simple, warm language for explaining the diagnosis, plus answers to questions children often ask.", alt: "Guidebook page 6, Explaining the DLD Diagnosis, with a sample explanation and common questions children ask" },
];

const SECTIONS = [
  "Celebrating Your Child's Talents",
  "Acknowledging Challenges",
  "Explaining the DLD Diagnosis",
  "Checking for Understanding",
  "Sharing Your Diagnosis (If and When You're Ready)",
  "Normalizing the Diagnosis",
  "Finding Role Models",
  "Accessing Support at School",
  "Practicing Communication Skills",
  "Creating a Helpful Tool",
  "Helping Others Understand DLD",
  "Looking Forward",
];

const BONUS = [
  "Classroom Discussion Participation Strategies",
  "Word Finding Strategies Poster",
  "Descriptive & Connecting Words Guide",
  "DLD Awareness Flyer",
];

const FAQS = [
  { question: "What's included?", answer: "A 27-page printable PDF with 12 guided sections and bonus resources, designed to help you talk with your child about DLD." },
  { question: "Is this a digital or physical product?", answer: "The Parent Guidebook is a digital PDF download." },
  { question: "Do I need Dan and the Paper Airplane to use it?", answer: "The guidebook is written as a companion to Dan and the Paper Airplane and works best alongside the story." },
  { question: "Can I print the activities?", answer: "Yes. The guidebook is a printable PDF, so you can print the pages you want to use at home." },
  { question: "How will I receive my purchase?", answer: "After payment, you will get a secure download link on the confirmation page and by email." },
  { question: "Do I need an account?", answer: "No. You can check out as a guest with just your email address." },
];

const BuyButton = ({ className = "" }: { className?: string }) => {
  const [loading, setLoading] = useState(false);

  const startCheckout = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { resource_id: RESOURCE_ID },
      });
      if (error || !data?.url) {
        throw new Error(data?.error || "Checkout failed");
      }
      window.location.href = data.url;
    } catch {
      toast.error("Checkout could not be started. Please try again in a moment.");
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={startCheckout}
      disabled={loading}
      className={`inline-flex items-center justify-center min-h-[48px] px-8 bg-deep-purple text-deep-purple-foreground text-[14px] font-semibold rounded-md hover:bg-deep-purple/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60 ${className}`}
    >
      {loading ? "Redirecting to checkout…" : "Get the Parent Guidebook"}
    </button>
  );
};

const ParentGuidebook = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Parent Guidebook: How to Explain DLD to Your Child | Empowered DLD"
        description="A printable 27-page guidebook to help parents explain Developmental Language Disorder to their child, celebrate strengths, and build self-advocacy."
        path="/shop/parent-guidebook"
        noindex
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
          { name: "Parent Guidebook", path: "/shop/parent-guidebook" },
        ]}
      />
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-12 md:py-20">
          <div className="max-w-[1100px] mx-auto px-6 md:px-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
            <div className="flex-1 order-2 lg:order-1">
              <p className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">
                Parent Guidebook
              </p>
              <h1 className="text-[32px] md:text-[44px] font-black text-foreground leading-[1.08] mb-4">
                How Do I Explain DLD to My Child?
              </h1>
              <p className="text-[15px] md:text-[16px] text-muted-foreground leading-[1.7] max-w-[520px] mb-6">
                <em>Discussing DLD with Your Child</em> gives you the words, prompts, and activities to help your child understand their DLD, feel proud of who they are, and speak up for what they need.
              </p>
              <ul className="text-[14px] text-foreground space-y-1.5 mb-7">
                <li>Digital, printable PDF · 27 pages</li>
                <li>12 guided sections plus bonus resources</li>
                <li>Created by a Speech-Language Pathologist and an Educator</li>
              </ul>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <BuyButton className="w-full sm:w-auto" />
                <span className="text-[18px] font-bold text-foreground">{PRICE}</span>
              </div>
            </div>
            <div className="order-1 lg:order-2 w-full max-w-[320px] lg:max-w-none lg:w-[38%]">
              <img
                src={cover}
                alt="Cover of Discussing DLD with Your Child, the parent guidebook for Dan and the Paper Airplane"
                className="w-full h-auto rounded-xl"
                fetchPriority="high"
              />
            </div>
          </div>
        </section>

        {/* What's inside */}
        <section className="py-12 md:py-20 bg-secondary/40">
          <div className="max-w-[1100px] mx-auto px-6 md:px-10">
            <h2 className="text-[26px] md:text-[34px] font-black text-foreground leading-[1.15] mb-3">
              A look inside
            </h2>
            <p className="text-[15px] text-muted-foreground leading-[1.7] max-w-[600px] mb-10">
              Real pages from the guidebook. Each section is short, practical, and written to be used together with your child.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[760px]">
              {PAGES.map((p) => (
                <figure key={p.title}>
                  <img src={p.src} alt={p.alt} loading="lazy" className="w-full h-auto rounded-lg border border-border shadow-sm bg-background" />
                  <figcaption className="mt-4">
                    <h3 className="text-[17px] font-bold text-foreground mb-1">{p.title}</h3>
                    <p className="text-[14px] text-muted-foreground leading-[1.6]">{p.text}</p>
                  </figcaption>
                </figure>
              ))}
            </div>

            {/* Section titles */}
            <div className="mt-12 max-w-[760px]">
              <h3 className="text-[20px] md:text-[24px] font-bold text-foreground mb-4">
                The 12 guided sections
              </h3>
              <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-[14px] text-foreground list-decimal list-outside pl-5">
                {SECTIONS.map((s) => (
                  <li key={s} className="leading-[1.6]">{s}</li>
                ))}
              </ol>
              <h3 className="text-[20px] md:text-[24px] font-bold text-foreground mt-10 mb-4">
                Plus bonus tools
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-[14px] text-foreground list-disc list-outside pl-5">
                {BONUS.map((b) => (
                  <li key={b} className="leading-[1.6]">{b}</li>
                ))}
              </ul>
            </div>

            <div className="mt-10">
              <BuyButton className="w-full sm:w-auto" />
            </div>
          </div>
        </section>

        {/* Creators */}
        <section className="py-12 md:py-20">
          <div className="max-w-[1100px] mx-auto px-6 md:px-10 flex flex-col lg:flex-row items-center gap-10">
            <img src={founders} alt="Jinean Whitley and Camesha Russell, co-founders of Empowered DLD" loading="lazy" className="w-full lg:w-[42%] h-auto rounded-xl object-cover max-h-[500px]" />
            <div className="flex-1">
              <h2 className="text-[26px] md:text-[32px] font-black text-foreground leading-[1.15] mb-4">
                Created by a Speech-Language Pathologist and an Educator
              </h2>
              <p className="text-[15px] text-muted-foreground leading-[1.7] mb-3">
                Jinean Whitley, M.Sc.A., is a Speech-Language Pathologist. Camesha Russell is an Educator. Together they wrote the Living Life with DLD series so children with DLD could see themselves in a story.
              </p>
              <p className="text-[15px] text-muted-foreground leading-[1.7]">
                This guidebook brings that same care to the conversations parents have at home.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="pb-8">
          <div className="max-w-[760px] mx-auto px-6 md:px-10">
            <BlogFAQAccordion items={FAQS} />
          </div>
        </section>

        {/* More resources */}
        <section className="pb-16 md:pb-24">
          <div className="max-w-[760px] mx-auto px-6 md:px-10 text-center">
            <h2 className="text-[22px] md:text-[26px] font-bold text-foreground mb-3">Looking for More DLD Resources?</h2>
            <Link to="/resources" className="inline-flex items-center justify-center min-h-[44px] px-6 border border-foreground/30 text-foreground text-[13px] font-semibold rounded-md hover:bg-secondary transition-colors">
              Explore DLD Resources
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ParentGuidebook;
