import Header from "@/components/Header";
import FreeCourseHero from "@/components/FreeCourseHero";
import WhatYoullLearnSection from "@/components/WhatYoullLearnSection";
import CreatedByExpertsSection from "@/components/CreatedByExpertsSection";
import CourseTestimonialsSection from "@/components/CourseTestimonialsSection";
import ChoosePathCTA from "@/components/ChoosePathCTA";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const FreeCourse = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Free DLD Course — Learn About Developmental Language Disorder | Empowered DLD"
        description="Take our free, self-paced course on Developmental Language Disorder. Learn what DLD is, how to identify it, and practical strategies to support children at home and in the classroom."
        path="/resources/free-course"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
          { name: "Free Course", path: "/resources/free-course" },
        ]}
      />
      <Header />
      <main>
        <FreeCourseHero />
        <WhatYoullLearnSection />
        <CreatedByExpertsSection />
        <CourseTestimonialsSection />
        <section className="py-16 md:py-20 bg-muted">
          <div className="container px-6 md:px-8 text-center">
            <h2 className="text-[24px] md:text-[32px] lg:text-[38px] font-black text-foreground leading-[1.15]">
              Self-Paced. Free. Always Available.
            </h2>
          </div>
        </section>
        <ChoosePathCTA />
      </main>
      <Footer />
    </div>
  );
};

export default FreeCourse;
