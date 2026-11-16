export type TranslatedBook = { title: string; description: string; href: string };

// Product-specific editions already linked by the existing Books page.
// The existing Czech destination resolved to a Persian edition, so it is excluded.
const airplane = (language: string, href: string): TranslatedBook => ({ title: "Dan and the Paper Airplane", description: `${language} edition. Book 1 in the Living Life with DLD series.`, href });
const friends = (language: string, href: string): TranslatedBook => ({ title: "Dan & Daria Make Friends", description: `${language} edition. A story about friendship and self-advocacy.`, href });

export const TRANSLATED_BOOKS: Record<string, TranslatedBook[]> = {
  French: [airplane("French", "https://www.amazon.ca/dp/B0DZCNPK9J"), friends("French", "https://www.amazon.ca/dp/B0G4DGGN5V")],
  Spanish: [airplane("Spanish", "https://www.amazon.com/dp/B0F12L8T4S")],
  Welsh: [airplane("Welsh", "https://www.amazon.co.uk/dp/B0FR8Y17HG"), friends("Welsh", "https://www.amazon.co.uk/dp/B0FR9K8JJT")],
  Persian: [airplane("Persian", "https://www.amazon.com/dp/1069763616")],
};