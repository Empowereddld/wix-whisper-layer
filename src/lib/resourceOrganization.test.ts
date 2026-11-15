import { describe, expect, it } from "vitest";
import { matchesLanguageAndType, relatedResources, resourceFormat, translationGroup, RESOURCE_LANGUAGES } from "./resourceOrganization";
import { authPath, getResourceReturn, rememberResourceReturn, safeResourceReturn, clearResourceReturn } from "./resourceReturn";
const resource = (id: string, language: string, type = "poster", group: string | null = null) => ({ id, languages: [language], resource_type: type, roles: ["parent"], translation_group_id: group });
describe("resource organization", () => {
  it("combines language and type filters", () => {
    const resources = [resource("a", "French"), resource("b", "French", "guide"), resource("c", "English")];
    expect(resources.filter((r) => matchesLanguageAndType(r, ["French"], ["poster"])).map((r) => r.id)).toEqual(["a"]);
  });
  it("includes all eleven requested languages and accepts additional assignments", () => {
    expect(RESOURCE_LANGUAGES).toEqual(["English", "French", "Spanish", "Italian", "Catalan", "Welsh", "Persian", "Arabic", "Chinese", "Czech", "Jamaican Creole"]);
    expect(matchesLanguageAndType(resource("a", "German"), ["German"], [])).toBe(true);
  });
  it("prioritizes same-language recommendations before other languages and excludes the current item", () => {
    const current = resource("a", "French");
    expect(relatedResources(current, [current, resource("b", "English"), resource("c", "French", "guide"), resource("d", "French"), resource("e", "Welsh")]).map((r) => r.id)).toEqual(["d", "c", "b"]);
  });
  it("connects separate translation items to one canonical resource", () => {
    expect(translationGroup(resource("french", "French", "poster", "english"))).toBe(translationGroup(resource("english", "English")));
  });
  it("preserves both PNG and PDF format labels", () => {
    expect(resourceFormat({ file_url: "/poster.png" })).toBe("PNG");
    expect(resourceFormat({ file_url: "/guide.pdf?token=x" })).toBe("PDF");
    expect(resourceFormat({ file_url: null })).toBe("File");
  });
});
describe("selected resource return", () => {
  it("persists the exact resource across authentication steps", () => {
    const target = "/hub/resource/abc-123";
    rememberResourceReturn(target);
    expect(getResourceReturn("")).toBe(target);
    expect(getResourceReturn(authPath("/signup/role", target).split("?")[1])).toBe(target);
    clearResourceReturn();
    expect(getResourceReturn("")).toBe("/hub");
  });
  it("rejects external or unrelated destinations", () => {
    for (const value of ["https://evil.example", "//evil.example", "/admin", "/hub/login", "/hub/resource/a#token", "/hub/resource/a/../../admin"]) expect(safeResourceReturn(value)).toBeNull();
  });
});