import educatorsRightFit from "@/assets/educators-right-fit.png";

const IsThisRightSection = () => {
  return (
    <section className="pt-4 md:pt-6 lg:pt-10 pb-4 md:pb-8 lg:pb-16">
      <div className="container px-6 md:px-8">
        <h2 className="text-[28px] md:text-[34px] lg:text-[38px] font-black leading-[1.12] mb-6 md:mb-8 lg:mb-10">
          Is This Right for Your School?
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-stretch">
          <div className="rounded-xl overflow-hidden order-2 lg:order-1">
            <img
              src={educatorsRightFit}
              alt="Teacher working with students in classroom"
               className="w-full h-full object-cover object-[center_80%] max-h-[220px] md:max-h-[300px] lg:max-h-[500px] aspect-[16/9] lg:aspect-auto"
               loading="lazy"
            />
          </div>

          <div className="flex flex-col justify-start pt-0 md:pt-2 order-1 lg:order-2">
            <p className="text-[14px] md:text-[15px] text-muted-foreground font-semibold mb-3">
              This program is designed for schools that:
            </p>
            <ul className="list-disc pl-5 space-y-2 md:space-y-4 text-[13px] md:text-[14px] lg:text-[15px] text-muted-foreground leading-[1.7] mb-6 md:mb-8">
              <li>Want to improve outcomes for students with language disorders</li>
              <li>Serve multilingual or culturally diverse communities</li>
              <li>Are looking for practical, ready-to-use resources</li>
              <li>Want to build staff capacity through professional development</li>
              <li>Need to strengthen the connection between school and home</li>
              <li>Are committed to equity and inclusive practices</li>
            </ul>

            <p className="text-[13px] md:text-[14px] lg:text-[15px] text-muted-foreground leading-[1.7] mb-6">
              Whether you're just starting to learn about DLD or you're ready to launch a school-wide initiative, we'll meet you where you are.
            </p>

            <div className="flex justify-center">
              <a
                href="#contact"
                className="inline-block border border-foreground text-foreground px-8 md:px-10 py-3 md:py-4 text-[12px] md:text-[13px] font-bold tracking-wider uppercase hover:bg-foreground hover:text-background transition-colors"
              >
                Book a Free Consultation
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IsThisRightSection;
