import { describe, expect, it } from "vitest";
import { translationsForLanguage, translatedResourcePath } from "./translatedResources";

describe("public translated resource connections", () => {
  it("automatically groups only published resources by their assigned language", () => {
    const items = [
      { id: "french", languages: ["French"], is_published: true },
      { id: "draft", languages: ["French"], is_published: false },
      { id: "spanish", languages: ["Spanish"], is_published: true },
      { id: "multilingual", languages: ["French", "Welsh"], is_published: true },
    ];
    expect(translationsForLanguage(items, "French").map((item) => item.id)).toEqual(["french", "multilingual"]);
    expect(translationsForLanguage(items, "Welsh").map((item) => item.id)).toEqual(["multilingual"]);
  });
  it("links to the exact individual Library item, never the gallery or file", () => {
    expect(translatedResourcePath({ id: "aa22b1a2-f9cb-4f8f-a837-cdd6266189b2" })).toBe("/hub/resource/aa22b1a2-f9cb-4f8f-a837-cdd6266189b2");
  });
});