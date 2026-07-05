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

const BOOKS_ITEM_LIST_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Living Life with DLD Book Series",
  description:
    "A five-book series that helps children understand Developmental Language Disorder (DLD), feel confident, and know they are not alone.",
  itemListOrder: "https://schema.org/ItemListOrderAscending",
  numberOfItems: 5,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Book",
        name: "Dan and the Paper Airplane",
        bookFormat: "https://schema.org/Paperback",
        inLanguage: "en",
        author: { "@type": "Person", name: "Camesha Russell" },
        publisher: { "@type": "Organization", name: "Empowered DLD" },
        description:
          "A picture book that helps children recognize language challenges and experience what it feels like to live with DLD.",
        url: "https://mybook.to/nwINcA",
        image: "https://empowereddld.com/og-empowered-dld.png",
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Book",
        name: "Dan and the Paper Airplane: Parent Guidebook",
        bookFormat: "https://schema.org/Paperback",
        inLanguage: "en",
        author: { "@type": "Person", name: "Camesha Russell" },
        publisher: { "@type": "Organization", name: "Empowered DLD" },
        description:
          "A practical companion for parents with conversation prompts, strategies, and confidence-building activities for children with DLD.",
        url: "https://mybook.to/nwINcA",
        image: "https://empowereddld.com/og-empowered-dld.png",
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Book",
        name: "Dan & Daria Make Friends",
        bookFormat: "https://schema.org/Paperback",
        inLanguage: "en",
        author: { "@type": "Person", name: "Camesha Russell" },
        publisher: { "@type": "Organization", name: "Empowered DLD" },
        description:
          "A story about friendship, self-advocacy, and being brave for children with Developmental Language Disorder.",
        url: "https://mybook.to/nwINcA",
        image: "https://empowereddld.com/og-empowered-dld.png",
      },
    },
    {
      "@type": "ListItem",
      position: 4,
      item: {
        "@type": "Book",
        name: "Dan and Daria Go to a Birthday Party",
        bookFormat: "https://schema.org/Paperback",
        inLanguage: "en",
        author: { "@type": "Person", name: "Camesha Russell" },
        publisher: { "@type": "Organization", name: "Empowered DLD" },
        description:
          "Explores what DLD looks like in social settings and helps children find their voice through the Pause Button strategy.",
        url: "https://mybook.to/nwINcA",
        image: "https://empowereddld.com/og-empowered-dld.png",
      },
    },
    {
      "@type": "ListItem",
      position: 5,
      item: {
        "@type": "Book",
        name: "Dan & Daria and The Theatre Exchange",
        bookFormat: "https://schema.org/Paperback",
        inLanguage: "en",
        author: { "@type": "Person", name: "Camesha Russell" },
        publisher: { "@type": "Organization", name: "Empowered DLD" },
        description:
          "A story about being brave when words are hard, exploring anxiety, self-advocacy, and finding people who understand DLD.",
        url: "https://mybook.to/nwINcA",
        image: "https://empowereddld.com/og-empowered-dld.png",
      },
    },
  ],
};

const Books = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Living Life with DLD Book Series | Empowered DLD"
        description="The Living Life with DLD book series helps children understand DLD, feel confident, and know they are not alone. A warm entry point for every family."
        path="/shop/books"
        jsonLd={BOOKS_ITEM_LIST_JSON_LD}
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
