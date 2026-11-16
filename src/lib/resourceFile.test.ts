import { afterEach, describe, expect, it, vi } from "vitest";
import { deliverResourceFile, resourceFilename } from "./resourceFile";

afterEach(() => vi.restoreAllMocks());

describe("resource file downloads", () => {
  it("downloads original PNGs with a descriptive PNG filename", () => {
    expect(resourceFilename("Word Finding Strategies - French", "image/png", "https://example.com/file")).toBe("Word Finding Strategies - French.png");
  });
  it("downloads PDFs with the original PDF extension", () => {
    expect(resourceFilename("Dan and Daria Self Advocacy Poster", "application/pdf", "https://example.com/file?token=x")).toBe("Dan and Daria Self Advocacy Poster.pdf");
  });
  it("delivers a named file rather than opening a tab", async () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    const create = vi.fn(() => "blob:resource");
    vi.stubGlobal("URL", { createObjectURL: create, revokeObjectURL: vi.fn() });
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function () {
      expect(this.download).toBe("Poster.png");
      expect(this.href).toBe("blob:resource");
    });
    await deliverResourceFile(new Blob(["original"], { type: "image/png" }), "Poster.png");
    expect(click).toHaveBeenCalledOnce();
    vi.unstubAllGlobals();
  });
  it("shares a named PNG file on supported phones", async () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    const share = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { canShare: () => true, share });
    await deliverResourceFile(new Blob(["original"], { type: "image/png" }), "French poster.png");
    expect(share).toHaveBeenCalledWith(expect.objectContaining({ files: [expect.objectContaining({ name: "French poster.png", type: "image/png" })] }));
    vi.unstubAllGlobals();
  });
});