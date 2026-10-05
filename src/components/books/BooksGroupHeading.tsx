const BooksGroupHeading = ({ title, id }: { title: string; id?: string }) => (
  <div id={id} className="max-w-[1100px] mx-auto px-6 md:px-10 pt-10 md:pt-14 scroll-mt-24">
    <h2 className="text-[12px] md:text-[14px] font-bold uppercase tracking-[0.14em] text-primary border-b border-border pb-3">
      {title}
    </h2>
  </div>
);

export default BooksGroupHeading;
