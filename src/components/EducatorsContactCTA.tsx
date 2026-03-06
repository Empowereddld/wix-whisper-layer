import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";
import { DotBackground } from "@/components/ui/dot-background";
import schoolHallway from "@/assets/school-hallway-bg.webp";

const EducatorsContactCTA = () => {
  const fade = useScrollFadeIn();

  return (
    <section id="contact" className="bg-muted py-10 md:py-14 lg:py-20">
      <div className="container px-6 md:px-8">
        <div
          ref={fade.ref}
          className={`relative overflow-hidden bg-black text-white rounded-2xl px-8 md:px-16 py-14 md:py-20 text-center ${fade.className}`}
        >
          <DotBackground />
          <div className="relative z-10 max-w-[600px] mx-auto">
            <h2 className="text-[24px] md:text-[34px] lg:text-[42px] font-black leading-[1.1] mb-4">
              Want to Bring This to Your School?
            </h2>
            <p className="text-white/70 text-[14px] md:text-[16px] leading-[1.7] mb-8">
              Get our free information packet with program details, pricing, and sample materials. Or book a free consultation to discuss your school's needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:info@empowereddld.com"
                className="inline-flex items-center justify-center h-12 md:h-14 px-8 md:px-10 bg-primary text-primary-foreground text-[11px] md:text-[12px] lg:text-[13px] font-bold uppercase tracking-[0.12em] rounded-sm hover:bg-primary/90 transition-colors duration-200"
              >
                Get the Info Packet
              </a>
              <a
                href="mailto:info@empowereddld.com"
                className="inline-flex items-center justify-center h-12 md:h-14 px-8 md:px-10 border border-white text-white text-[11px] md:text-[12px] lg:text-[13px] font-bold uppercase tracking-[0.12em] rounded-sm hover:bg-white hover:text-black transition-colors duration-200"
              >
                Book a Consultation
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducatorsContactCTA;
