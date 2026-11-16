import { describe, expect, it } from "vitest";
import { TRANSLATED_BOOKS } from "./translatedBooks";

describe("translated book purchase destinations", () => {
  it("keeps each known edition connected to its own product rather than the storefront", () => {
    expect(Object.entries(TRANSLATED_BOOKS).map(([language, books]) => [language, books.map((book) => book.href)])).toEqual([
      ["French", ["https://www.amazon.ca/dp/B0DZCNPK9J", "https://www.amazon.ca/dp/B0G4DGGN5V"]],
      ["Spanish", ["https://www.amazon.com/dp/B0F12L8T4S"]],
      ["Welsh", ["https://www.amazon.co.uk/dp/B0FR8Y17HG", "https://www.amazon.co.uk/dp/B0FR9K8JJT"]],
      ["Persian", ["https://www.amazon.com/dp/1069763616"]],
    ]);
  });
  it("never routes the Czech edition to the mismatched Persian listing", () => {
    expect(TRANSLATED_BOOKS.Czech).toBeUndefined();
  });
});