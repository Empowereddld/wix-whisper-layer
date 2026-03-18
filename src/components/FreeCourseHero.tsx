import courseDevices from "@/assets/course-devices.webp";

const FreeCourseHero = () => {
  return (
    <section className="pt-6 md:pt-10 lg:pt-16 pb-14 md:pb-16 lg:pb-16">
      <div className="container px-6 md:px-8">
        <div className="flex flex-col lg:flex-row lg:items-stretch lg:gap-6">
          {/* Gray card background */}
          <div className="bg-muted rounded-xl lg:rounded-2xl lg:w-[58%] lg:flex-shrink-0 py-10 md:py-14 lg:py-24 px-6 md:px-8 lg:px-16">
            <span className="inline-block bg-deep-purple text-deep-purple-foreground text-[12px] md:text-[14px] lg:text-[16px] font-bold uppercase tracking-[0.14em] px-6 md:px-8 py-2 md:py-2.5 rounded-sm mb-4 md:mb-6">
              Free Course
            </span>
            <h1 className="text-[30px] md:text-[36px] lg:text-[48px] font-black text-foreground leading-[1.12] mb-4 md:mb-5 max-w-[500px]">
              Learn How to Support a Child With DLD
            </h1>
            <p className="text-[13px] md:text-[14px] lg:text-[15px] text-muted-foreground leading-[1.7] mb-6 md:mb-8 max-w-[500px]">
              Free video lessons for parents and educators. Practical strategies you can use immediately at home, in therapy, and in the classroom.
            </p>
            <a
              href="https://youtube.com/playlist?list=PLzfiOYFA1If7CpwIvkvipjplTZawhjw97&si=oaF0Fjhgp-AAhny4"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-12 md:h-14 px-8 md:px-10 bg-black text-white text-[11px] md:text-[12px] lg:text-[13px] font-bold uppercase tracking-[0.12em] rounded-sm hover:bg-black/85 transition-colors duration-200"
            >
              Watch Now
            </a>
          </div>

          {/* Image */}
          <div className="mt-4 lg:mt-0 lg:flex-1 flex items-center justify-center p-4 lg:p-8">
            <img
              src={courseDevices}
              alt="Free DLD course shown on multiple devices with YouTube"
              className="w-full max-w-[520px] h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreeCourseHero;
