import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BooksHero from "@/components/BooksHero";

const Books = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <BooksHero />
      </main>
      <Footer />
    </div>
  );
};

export default Books;
