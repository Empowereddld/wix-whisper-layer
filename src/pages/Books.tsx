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
import SEOHead, { BASE_URL } from "@/components/SEOHead";
import BooksIntro from "@/components/books/BooksIntro";
import BooksGroupHeading from "@/components/books/BooksGroupHeading";
import BooksFaqSection from "@/components/books/BooksFaqSection";
import ContinueExploringSection from "@/components/books/ContinueExploringSection";
import { BOOKS_FAQ } from "@/components/books/booksFaq";
import coverDan from "@/assets/book-dan-paper-airplane.webp";
import coverGuide from "@/assets/book-parent-guidebook.webp";
import coverFriends from "@/assets/book-dan-daria-make-friends.webp";
import coverParty from "@/assets/book-birthday-party-cover.webp";
import coverTheatre from "@/assets/book-theatre-exchange-cover.webp";

const PAGE_URL = `${BASE_URL}/shop/books`;
const ORG_ID = `${BASE_URL}/#organization`;
const abs = (src: string) => (src.startsWith("http") ? src : `${BASE_URL}${src}`);

const AUTHORS = [
  {
    "@type": "Person",
    "@id": `${BASE_URL}/#jinean-whitley`,
    name: "Jinean Whitley",
    honorificSuffix: "M.Sc.A.",
    jobTitle: "Speech-Language Pathologist",
    worksFor: { "@id": ORG_ID },
  },
  {
    "@type": "Person",
    "@id": `${BASE_URL}/#camesha-russell`,
    name: "Camesha Russell",
    jobTitle: "Educator",
    worksFor: { "@id": ORG_ID },
  },
];
const authorRefs = AUTHORS.map((a) => ({ "@id": a["@id"] }));

const BOOKS = [
  { id: "dan-and-the-paper-airplane", name: "Dan and the Paper Airplane", image: coverDan, position: 1,
    description: "A picture book that helps children recognize language challenges and experience what it feels like to live with DLD.",
    inLanguage: ["en", "fr", "es", "cs", "cy", "fa"] },
  { id: "dan-and-daria-make-friends", name: "Dan & Daria Make Friends", image: coverFriends, position: 2,
    description: "A story about friendship, self-advocacy, and being brave for children with Developmental Language Disorder.",
    inLanguage: ["en", "fr", "cy"] },
  { id: "dan-and-daria-birthday-party", name: "Dan and Daria Go to a Birthday Party", image: coverParty, position: 3,
    description: "Explores what DLD looks like in social settings and helps children find their voice through the Pause Button strategy.",
    inLanguage: "en" },
  { id: "dan-and-daria-theatre-exchange", name: "Dan & Daria and the Theatre Exchange", image: coverTheatre, position: 4,
    description: "A story about being brave when words are hard, exploring anxiety, self-advocacy, and finding people who understand DLD.",
    inLanguage: "en" },
];

const bookEntity = (b: { id: string; name: string; image: string; description: string; inLanguage: string | string[] }, extra: Record<string, unknown> = {}) => ({
  "@type": "Book",
  "@id": `${PAGE_URL}#${b.id}`,
  name: b.name,
  description: b.description,
  image: abs(b.image),
  url: "https://mybook.to/nwINcA",
  bookFormat: "https://schema.org/Paperback",
  inLanguage: b.inLanguage,
  author: authorRefs,
  publisher: { "@id": ORG_ID },
  ...extra,
});

const SERIES_ID = `${PAGE_URL}#series`;

const BOOKS_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "Empowered DLD",
      url: BASE_URL,
      logo: `${BASE_URL}/og-empowered-dld.png`,
      founder: authorRefs,
    },
    ...AUTHORS,
    {
      "@type": "BookSeries",
      "@id": SERIES_ID,
      name: "Living Life with DLD",
      description: "A series of children's books about Developmental Language Disorder (DLD).",
      author: authorRefs,
      publisher: { "@id": ORG_ID },
    },
    ...BOOKS.map((b) => bookEntity(b, { isPartOf: { "@id": SERIES_ID }, position: b.position })),
    bookEntity(
      {
        id: "parent-guidebook",
        name: "Dan and the Paper Airplane: Parent Guidebook",
        image: coverGuide,
        description: "A practical companion for parents with conversation prompts, strategies, and confidence-building activities to use alongside Dan and the Paper Airplane.",
        inLanguage: "en",
      },
      { audience: { "@type": "Audience", audienceType: "Parents" } },
    ),
    {
      "@type": "ItemList",
      name: "Living Life with DLD Storybooks",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: BOOKS.length,
      itemListElement: BOOKS.map((b) => ({ "@type": "ListItem", position: b.position, item: { "@id": `${PAGE_URL}#${b.id}` } })),
    },
    {
      "@type": "FAQPage",
      mainEntity: BOOKS_FAQ.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ],
};

const Books = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="DLD Books for Children | Living Life with DLD"
        description="Explore the Living Life with DLD children's book series from Empowered DLD. Relatable stories about communication, friendship, school, self-advocacy, and everyday life with Developmental Language Disorder."
        path="/shop/books"
        jsonLd={BOOKS_JSON_LD}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
          { name: "Books", path: "/shop/books" },
        ]}
      />
      <Header />
      <main className="flex-1">
        <BooksHero />
        <BooksIntro />
        <MoreThanAStorySection />
        <BooksGroupHeading title="Living Life with DLD Storybooks" />
        <BookDanSection />
        <BookMakeFriendsSection />
        <BookBirthdayPartySection />
        <BookTheatreExchangeSection />
        <BooksGroupHeading title="Parent Companion Guide" />
        <BookGuidebookSection />
        <WhoAreTheseBooksForSection />
        <BooksFaqSection />
        <ContinueExploringSection />
        <ChoosePathCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Books;
