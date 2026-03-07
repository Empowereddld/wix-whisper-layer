const DownloadablesHowItWorks = () => {
  return (
    <section className="bg-foreground text-background">
      <div className="container flex flex-col md:flex-row md:items-start md:justify-between gap-6 py-10 md:py-16 px-6 md:px-8">
        <h2 className="text-[18px] sm:text-[28px] md:text-[42px] font-bold leading-[1.15] max-w-[320px]">
          How It Works
        </h2>
        <div className="max-w-md flex flex-col gap-4">
          <p className="text-[15px] md:text-[17px] font-semibold text-background">
            One email. Instant access. Forever.
          </p>
          <p className="text-[11px] md:text-[16px] text-background/70 leading-[1.65]">
            Enter your email once and get immediate access to our entire resource library. Download what you need, when you need it.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DownloadablesHowItWorks;
