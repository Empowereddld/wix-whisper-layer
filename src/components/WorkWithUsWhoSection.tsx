const WorkWithUsWhoSection = () => {
  return (
    <section className="pt-6 md:pt-10 lg:pt-16 pb-10 md:pb-16 lg:pb-[120px] bg-muted">
      <div className="bg-black text-white px-6 md:px-8 py-5 lg:py-8 mb-6 md:mb-8 lg:mb-12">
        <div className="container px-0">
          <h2 className="text-[20px] md:text-[26px] lg:text-[32px] font-black leading-[1.15]">Who We Work With</h2>
        </div>
      </div>

      <div className="container px-6 md:px-8">
        <div className="max-w-[650px]">
          <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.7] mb-6">
            Our workshops and presentations are designed for organizations supporting children with language and learning differences.
          </p>

          <p className="text-[14px] md:text-[15px] text-muted-foreground font-semibold mb-3">
            We regularly collaborate with:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-[14px] md:text-[15px] text-muted-foreground leading-[1.7] mb-6">
            <li>school boards and classroom educators</li>
            <li>speech language pathologists and therapy teams</li>
            <li>universities and professional training programs</li>
            <li>parent organizations and advocacy groups</li>
          </ul>

          <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.7]">
            Sessions can be adapted for conferences, professional development days, or community learning events.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WorkWithUsWhoSection;
