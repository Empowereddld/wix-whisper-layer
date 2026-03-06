

const DownloadablesHowItWorks = () => {
  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="container px-6 md:px-8 max-w-[800px] mx-auto text-center">
        <h2 className="text-[28px] md:text-[36px] lg:text-[42px] font-black text-foreground leading-[1.1] mb-4">
          HOW IT WORKS
        </h2>
        <p className="text-[15px] md:text-[17px] font-semibold text-foreground mb-6">
          One email. Instant access. Forever.
        </p>
        <div className="flex items-start gap-3 text-left max-w-[650px] mx-auto">
          <div className="mt-0.5 w-8 h-8 rounded-full border border-foreground/30 flex items-center justify-center shrink-0">
            <ArrowRight className="w-4 h-4 text-foreground/60" />
          </div>
          <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.7]">
            Enter your email once and get immediate access to our entire resource library. Download what you need, when you need it.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DownloadablesHowItWorks;
