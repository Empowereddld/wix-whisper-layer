import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BooksHero from "@/components/BooksHero";
import MoreThanAStorySection from "@/components/MoreThanAStorySection";
import BookDanSection from "@/components/BookDanSection";
import BookGuidebookSection from "@/components/BookGuidebookSection";
import BookMakeFriendsSection from "@/components/BookMakeFriendsSection";
import BookBirthdayPartySection from "@/components/BookBirthdayPartySection";
import BookTheatreExchangeSection from "@/components/BookTheatreExchangeSection";

const Books = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <BooksHero />
        <MoreThanAStorySection />
        <BookDanSection />
        <BookGuidebookSection />
        <BookMakeFriendsSection />
        <BookBirthdayPartySection />
        <BookTheatreExchangeSection />
      </main>
      <Footer />
    </div>
  );
};

export default Books;
