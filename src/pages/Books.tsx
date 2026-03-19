import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BooksHero from "@/components/BooksHero";
import MoreThanAStorySection from "@/components/MoreThanAStorySection";
import BookDanSection from "@/components/BookDanSection";
import BookGuidebookSection from "@/components/BookGuidebookSection";
import BookMakeFriendsSection from "@/components/BookMakeFriendsSection";
import BookBirthdayPartySection from "@/components/BookBirthdayPartySection";
import BookTheatreExchangeSection from "@/components/BookTheatreExchangeSection";
import WhoAreTheseBooksForSection from "@/components/WhoAreTheseBooksForSection";
import ChoosePathCTA from "@/components/ChoosePathCTA";
import SEOHead from "@/components/SEOHead";

const Books = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Living Life with DLD Book Series — Children's Books About Language Disorder | Empowered DLD"
        description="Explore the Living Life with DLD book series. Stories that help children with Developmental Language Disorder feel seen, understood, and empowered. For families, classrooms, and therapy."
        path="/shop/books"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
          { name: "Books", path: "/shop/books" },
        ]}
      />
      <Header />
      <main className="flex-1">
        <BooksHero />
        <MoreThanAStorySection />
        <BookDanSection />
        <BookGuidebookSection />
        <BookMakeFriendsSection />
        <BookBirthdayPartySection />
        <BookTheatreExchangeSection />
        <WhoAreTheseBooksForSection />
        <ChoosePathCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Books;
