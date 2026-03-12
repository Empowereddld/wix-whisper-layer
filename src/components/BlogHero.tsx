const BlogHero = () => {
  return (
    <section className="bg-secondary py-16 md:py-24">
      <div className="max-w-[1100px] mx-auto px-6 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-3">
          Resources
        </p>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
          Blog
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-[600px] mx-auto">
          Insights, tips, and stories to help you support children with Developmental Language Disorder.
        </p>
      </div>
    </section>
  );
};

export default BlogHero;
