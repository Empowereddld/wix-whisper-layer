const MoreThanAStorySection = () => {
  return (
    <section className="bg-muted py-12 md:py-16">
      <div className="max-w-[1100px] mx-auto px-6 md:px-10">
        <h2 className="text-[24px] md:text-[30px] lg:text-[36px] font-black text-foreground leading-[1.1] mb-5 md:mb-6">
          More than just a story
        </h2>
        <div className="flex flex-col gap-5 max-w-[800px]">
          <p className="text-[14px] md:text-[15px] text-foreground leading-[1.75]">
            When children see themselves in a story, something powerful happens: they feel understood. And when parents and educators use books to open up conversations about DLD, it creates space for connection, compassion, and confidence.
          </p>
          <p className="text-[14px] md:text-[15px] text-foreground leading-[1.75]">
            Whether you're a parent reading at bedtime, an SLP using books in therapy, or a teacher building an inclusive classroom, these books work for you.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MoreThanAStorySection;
