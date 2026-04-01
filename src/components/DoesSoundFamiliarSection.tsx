const DoesSoundFamiliarSection = () => {
  return (
    <section className="py-10 md:py-16 lg:py-[120px] bg-muted">
      <div className="bg-black text-white px-6 md:px-8 py-5 lg:py-8 mb-6 md:mb-8 lg:mb-12">
        <div className="container px-0">
          <h2 className="text-[20px] md:text-[26px] lg:text-[32px] font-black leading-[1.15]">
            Does this sound familiar?
          </h2>
        </div>
      </div>

      <div className="container px-6 md:px-8">
        <div className="max-w-[650px]">
          <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.7] mb-6">
            You know your child is <span className="font-semibold text-foreground">struggling with language</span> but your concerns are being dismissed.
          </p>

          <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.7] mb-6">
            Maybe you've been told <span className="font-semibold text-foreground">"they'll grow out of it"</span> or <span className="font-semibold text-foreground">"they're fine"</span> but that doesn't feel right.
          </p>

          <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.7] mb-6">
            It is exhausting to watch your child struggle and feel like <span className="font-semibold text-foreground">nobody in their life has even heard of DLD</span>.
          </p>

          <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.7] mb-6">
            <span className="font-semibold text-foreground">It shouldn't be up to parents to do all the educating.</span> It is not fair that many teachers, doctors, and other adults haven't heard of DLD. Maybe you had to find this term during <span className="font-semibold text-foreground">late night internet searches</span> because your child's therapist hadn't even heard of it!
          </p>

          <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.7] mb-6">
            <span className="font-semibold text-foreground">Empowered DLD</span> was created to give families like yours the resources, language, and support to understand your child and help them thrive.
          </p>

          <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.7] font-semibold text-foreground">
            We can help you educate teachers and other professionals so your child can access what they need to thrive! You are not alone!
          </p>
        </div>
      </div>
    </section>
  );
};

export default DoesSoundFamiliarSection;
