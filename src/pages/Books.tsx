import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BooksHero from "@/components/BooksHero";
import MoreThanAStorySection from "@/components/MoreThanAStorySection";
import BookDanSection from "@/components/BookDanSection";

const Books = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <BooksHero />
        <MoreThanAStorySection />
        <BookDanSection />
      </main>
      <Footer />
    </div>
  );
};

export default Books;
