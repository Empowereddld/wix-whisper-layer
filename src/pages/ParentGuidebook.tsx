import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { MessageCircleHeart, Ear, Compass, RefreshCw, Gift, ZoomIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { trackGuidebookCheckout } from "@/lib/guidebookAnalytics";
import Header from "@/components/Header";
import ForParentsHero from "@/components/ForParentsHero";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import BlogFAQAccordion from "@/components/BlogFAQAccordion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import cover from "@/assets/book-parent-guidebook.webp";
import founders from "@/assets/founders-circle.webp";
import page4 from "@/assets/guidebook-p4.webp";
import page6 from "@/assets/guidebook-p6.webp";

const PRICE = "$9.99 USD";
const RESOURCE_ID = "1d54403b-1185-46dd-8307-b918a731e580";

const PAGES = [
  {
    src: page4,
    title: "Celebrate their strengths",
    text: "Before talking about challenges, start with what makes your child who they are. This activity helps you and your child recognize their talents, interests, and the many things that make them unique.",
    alt: "Guidebook page 4, Celebrating Your Child's Talents, with prompts for noticing your child's strengths",
  },
  {
    src: page6,
    title: "Explain DLD together",
    text: "Explore suggested language for explaining DLD in a way your child can understand, along with questions they may ask and ideas for responding.",
    alt: "Guidebook page 6, Explaining the DLD Diagnosis, with a sample explanation and common questions children ask",
  },
];

const BENEFITS = [
  {
    icon: MessageCircleHeart,
    title: "Find words that make sense to your child",
    text: "Explore ways to explain DLD using clear, supportive language that recognizes both strengths and challenges.",
  },
  {
    icon: Ear,
    title: "Make room for your child's perspective",
    text: "Use guided questions and activities to discover what your child understands, how they feel, and what they'd like others to know.",
  },
  {
    icon: Compass,
    title: "Build understanding and self-advocacy",
    text: "Explore ways to talk about helpful supports, communication strategies, and asking for what they need at school and beyond.",
  },
  {
    icon: RefreshCw,
    title: "Keep the conversation going",
    text: "Return to different sections as your child grows, has new experiences, and develops a deeper understanding of their DLD.",
  },
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
  "Descriptive & Connecting Words Guide",
  "Word Finding Strategies Poster",
  "DLD Awareness Flyer",
];

const FAQS = [
  { question: "What's included?", answer: "You'll receive a 27-page digital guidebook with 12 guided sections, suggested language, conversation prompts, and activities to complete with your child, plus four bonus resources." },
  { question: "Is this a digital or physical product?", answer: "This is a digital, printable PDF. No physical book will be shipped. You can read it on your device or print pages to use with your child." },
  { question: "Can I print the activities?", answer: "Yes! The guidebook is designed to be printable, so you can complete the activities together and revisit them as needed." },
  { question: "Do we need to complete every activity?", answer: "No. You can choose the sections that fit your child's interests, understanding, and readiness. You can also return to activities and conversations over time." },
  { question: "Do I need Dan and the Paper Airplane to use it?", answer: "The guidebook was designed to be used alongside *Dan and the Paper Airplane*, and we recommend reading the story with your child to get the most out of the activities. However, the guidebook also includes practical guidance, conversation prompts, and activities you can use independently. Some activities refer directly to Dan's story." },
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
      trackGuidebookCheckout(() => { window.location.href = data.url; });
    } catch {
      toast.error("Checkout could not be started. Please try again in a moment.");
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={startCheckout}
      disabled={loading}
      className={`h-auto min-h-[52px] px-5 sm:px-8 py-3 whitespace-normal bg-deep-purple text-deep-purple-foreground text-[16px] font-semibold rounded-md hover:bg-deep-purple/90 disabled:opacity-60 ${className}`}
    >
      {loading ? "Redirecting to checkout…" : `Get the Parent Guidebook · ${PRICE}`}
    </Button>
  );
};

const ParentGuidebook = () => {
  const [enlarged, setEnlarged] = useState<(typeof PAGES)[number] | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Parent Guidebook: How to Explain DLD to Your Child | Empowered DLD"
        description="A printable 27-page guidebook to help parents explain Developmental Language Disorder to their child, celebrate strengths, and build self-advocacy."
        path="/shop/parent-guidebook"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
          { name: "Parent Guidebook", path: "/shop/parent-guidebook" },
        ]}
      />
      <Header purchaseFocused />
      <main className="flex-1 [&_h1]:tracking-normal [&_h2]:tracking-normal [&_h3]:tracking-normal">
        <ForParentsHero />
        {/* Hero */}
        <section className="py-8 lg:py-10">
          <div className="max-w-[1100px] mx-auto px-6 md:px-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-10">
            <div className="flex-1 order-2 lg:order-1">
              <p className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">
                Parent Guidebook
              </p>
              <h1 className="text-[32px] md:text-[44px] font-black text-foreground leading-[1.08] mb-3">
                How Do I Explain DLD to My Child?
              </h1>
              <p className="text-[18px] md:text-[20px] font-semibold text-foreground leading-[1.4] mb-4">
                Find the words to talk about DLD, together.
              </p>
              <p className="text-[16px] md:text-[17px] text-muted-foreground leading-[1.7] max-w-[520px] mb-3">
                Talking with your child about Developmental Language Disorder (DLD) can raise a lot of questions. How do you explain the challenges while celebrating their strengths? Where do you begin?
              </p>
              <p className="text-[16px] md:text-[17px] text-muted-foreground leading-[1.7] max-w-[520px] mb-3">
                <em>Discussing DLD with Your Child</em> gives you practical guidance, suggested language, and activities to help you and your child explore DLD together, one conversation at a time.
              </p>
              <p className="text-[13px] md:text-[14px] font-semibold text-foreground mb-5">
                27-page printable PDF | 12 guided sections | 4 bonus resources
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <BuyButton className="w-full sm:w-auto" />
              </div>
              <p className="text-[13px] text-muted-foreground mt-3">
                <em>Digital download. Print the activities or use the guide on your device.</em>
              </p>
              <p className="text-[14px] text-muted-foreground mt-3">
                Created by a speech-language pathologist and an educator.
              </p>
            </div>
            <div className="order-1 lg:order-2 w-full max-w-[360px] lg:max-w-none lg:w-[40%] shrink-0">
              <div className="grid grid-cols-[1.15fr_1fr] gap-3 items-center">
              <img
                src={cover}
                alt="Cover of Discussing DLD with Your Child, the parent guidebook for Dan and the Paper Airplane"
                className="w-full h-auto rounded-lg"
                fetchPriority="high"
              />
                <img src={page4} alt={PAGES[0].alt} className="w-full h-auto rounded-md border border-border shadow-sm" />
              </div>
              <p className="text-[14px] font-semibold text-primary text-center mt-4">Printable PDF guidebook</p>
            </div>
          </div>
        </section>

        {/* You don't have to explain everything */}
        <section className="py-12 md:py-20 bg-secondary/40">
          <div className="max-w-[760px] mx-auto px-6 md:px-10">
            <h2 className="text-[26px] md:text-[34px] font-black text-foreground leading-[1.15] mb-5">
              You don't have to explain everything in one conversation.
            </h2>
            <p className="text-[16px] md:text-[17px] text-muted-foreground leading-[1.7] mb-4">
              Understanding DLD takes time. Your child might ask a question while reading together, after a challenging day at school, or when they notice differences between themselves and their peers.
            </p>
            <p className="text-[16px] md:text-[17px] text-muted-foreground leading-[1.7] mb-4">
                Some conversations will be short. Others may bring unexpected questions. There's no need to cover everything at once.
            </p>
            <p className="text-[16px] md:text-[17px] font-semibold text-foreground leading-[1.6] mb-4">
              What matters is creating space for your child to understand their DLD, recognize their strengths, and talk openly about the support they need.
            </p>
            <p className="text-[16px] md:text-[17px] text-muted-foreground leading-[1.7]">
                The guidebook helps you create opportunities for these meaningful conversations, at your child's own pace.
            </p>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-12 md:py-20">
          <div className="max-w-[1100px] mx-auto px-6 md:px-10">
            <h2 className="text-[26px] md:text-[34px] font-black text-foreground leading-[1.15] mb-10">
              How this guidebook can help your family
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {BENEFITS.map((b) => (
                <div key={b.title} className="rounded-xl border border-border bg-background p-6 md:p-7">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <b.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-[17px] md:text-[18px] font-bold text-foreground leading-[1.35] mb-2">
                    {b.title}
                  </h3>
                  <p className="text-[16px] text-muted-foreground leading-[1.7]">{b.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* A look inside */}
        <section className="py-12 md:py-20 bg-secondary/40">
          <div className="max-w-[1100px] mx-auto px-6 md:px-10">
            <h2 className="text-[26px] md:text-[34px] font-black text-foreground leading-[1.15] mb-3">
              A look inside the guidebook
            </h2>
            <p className="text-[16px] md:text-[17px] text-muted-foreground leading-[1.7] max-w-[600px] mb-10">
              Every section is designed to help you move from wondering what to say to having a meaningful conversation with your child.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[820px]">
              {PAGES.map((p) => (
                <figure key={p.title}>
                  <Button variant="ghost"
                    type="button"
                    onClick={() => setEnlarged(p)}
                    className="relative block w-full h-auto p-0 group hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
                    aria-label={`Enlarge preview: ${p.title}`}
                  >
                    <img src={p.src} alt={p.alt} loading="lazy" className="w-full h-auto rounded-lg border border-border shadow-sm bg-background" />
                    <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-background/90 text-foreground text-[12px] font-semibold px-2.5 py-1.5 rounded-md shadow-sm opacity-90 group-hover:opacity-100 transition-opacity">
                      <ZoomIn className="w-3.5 h-3.5" /> Enlarge
                    </span>
                  </Button>
                  <figcaption className="mt-4">
                    <h3 className="text-[17px] font-bold text-foreground mb-1">{p.title}</h3>
                    <p className="text-[16px] text-muted-foreground leading-[1.7]">{p.text}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
            <div className="mt-10">
              <BuyButton className="w-full sm:w-auto" />
            </div>
          </div>
        </section>

        {/* What's included */}
        <section className="py-12 md:py-20">
          <div className="max-w-[1100px] mx-auto px-6 md:px-10">
            <h2 className="text-[26px] md:text-[34px] font-black text-foreground leading-[1.15] mb-3">
              What's included?
            </h2>
            <h3 className="text-[19px] md:text-[22px] font-bold text-foreground mt-8 mb-3">
              12 guided sections to explore together
            </h3>
            <p className="text-[16px] md:text-[17px] text-muted-foreground leading-[1.7] max-w-[640px] mb-6">
              From the first conversations about DLD to building understanding and self-advocacy, the guidebook takes you through:
            </p>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-[16px] text-foreground list-decimal list-outside pl-5 max-w-[760px]">
              {SECTIONS.map((s) => (
                <li key={s} className="leading-[1.6]">{s}</li>
              ))}
            </ol>
            <p className="text-[16px] md:text-[17px] text-muted-foreground leading-[1.7] max-w-[640px] mt-6">
              You can work through the guidebook together or choose the sections that feel most relevant to your child right now.
            </p>

            <div className="mt-10 rounded-xl border border-border bg-secondary/40 p-6 md:p-8 max-w-[760px]">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Gift className="w-4.5 h-4.5 text-primary" />
                </div>
                <h3 className="text-[19px] md:text-[22px] font-bold text-foreground m-0">
                  Plus 4 bonus resources
                </h3>
              </div>
              <p className="text-[16px] text-muted-foreground leading-[1.7] mb-4">
                Practical tools you can print, reference, and share:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-[16px] text-foreground list-disc list-outside pl-5">
                {BONUS.map((b) => (
                  <li key={b} className="leading-[1.6]">{b}</li>
                ))}
              </ul>
            </div>

            <p className="text-[16px] md:text-[17px] font-semibold text-foreground mt-10">
              One guidebook. Twelve guided sections. Four additional resources. {PRICE}.
            </p>
          </div>
        </section>

        {/* Creators */}
        <section className="py-12 md:py-20 bg-secondary/40">
          <div className="max-w-[1100px] mx-auto px-6 md:px-10 flex flex-col lg:flex-row items-center gap-10">
            <img src={founders} alt="Jinean Whitley and Camesha Russell, co-founders of Empowered DLD" loading="lazy" className="w-full lg:w-[42%] h-auto rounded-xl object-cover max-h-[500px]" />
            <div className="flex-1">
              <h2 className="text-[26px] md:text-[32px] font-black text-foreground leading-[1.15] mb-4">
                Created by a Speech-Language Pathologist and an Educator
              </h2>
              <p className="text-[16px] md:text-[17px] text-muted-foreground leading-[1.7] mb-3">
                At Empowered DLD, we bring together clinical expertise, classroom experience, and a shared commitment to helping children with DLD understand themselves and feel supported.
              </p>
              <p className="text-[16px] md:text-[17px] text-muted-foreground leading-[1.7] mb-3">
                <strong className="text-foreground">Jinean Whitley, M.Sc.A.</strong>, is a Speech-Language Pathologist, and <strong className="text-foreground">Camesha Russell</strong> is an Educator.
              </p>
              <p className="text-[16px] md:text-[17px] text-muted-foreground leading-[1.7] mb-3">
                Together, we created this guidebook to support the conversations that happen beyond therapy sessions and classrooms, in the everyday moments children share with their families.
              </p>
              <p className="text-[16px] md:text-[17px] text-muted-foreground leading-[1.7] mb-3">
                We believe children deserve to understand their DLD without feeling defined by it. They deserve opportunities to explore their strengths, share their experiences, and learn that asking for support is something they can feel confident doing.
              </p>
              <p className="text-[16px] md:text-[17px] text-muted-foreground leading-[1.7]">
                And parents deserve practical guidance to help make those conversations possible.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 md:py-16">
          <div className="max-w-[760px] mx-auto px-6 md:px-10">
            <BlogFAQAccordion items={FAQS} />
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-12 md:py-20 bg-secondary border-t border-primary/10">
          <div className="max-w-[760px] mx-auto px-6 md:px-10 text-center">
            <h2 className="text-[24px] md:text-[30px] font-black text-foreground leading-[1.2] mb-4">
              Every child deserves to understand their DLD.
            </h2>
            <p className="text-[16px] md:text-[17px] text-muted-foreground leading-[1.7] mb-3">
              And every family deserves support in finding the words to talk about it.
            </p>
            <p className="text-[16px] md:text-[17px] text-muted-foreground leading-[1.7] mb-8">
              Whether you're preparing for your first conversation or looking for ways to keep the discussion going, this guidebook offers a thoughtful place to begin.
            </p>
            <BuyButton className="w-full sm:w-auto min-h-[56px] shadow-[var(--shadow-button)]" />
            <p className="text-[13px] text-muted-foreground mt-4">
              27-page digital, printable guidebook with 12 guided sections and 4 bonus resources.
            </p>
            <p className="mt-8">
              <Link to="/resources" className="text-[13px] text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors">
                Explore more DLD resources
              </Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />

      {/* Enlarged preview */}
      <Dialog open={!!enlarged} onOpenChange={(open) => !open && setEnlarged(null)}>
        <DialogContent className="max-w-[900px] w-[95vw] p-3 md:p-4">
          {enlarged && (
            <img src={enlarged.src} alt={enlarged.alt} className="w-full h-auto rounded-md" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParentGuidebook;
