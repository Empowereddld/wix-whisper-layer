import { describe, it, expect, beforeEach } from "vitest";
import { passFromHash, savePass, loadPass, clearPass } from "./guidebookPass";

const PASS = "g1.11111111-1111-1111-1111-111111111111.1.abcdefghijklmnopqrstuvwx";

describe("guidebook pass handling", () => {
  beforeEach(() => sessionStorage.clear());

  it("reads the pass from the link's #t= part", () => {
    expect(passFromHash(`#t=${encodeURIComponent(PASS)}`)).toBe(PASS);
  });

  it("ignores anything that is not a valid pass", () => {
    expect(passFromHash("#t=hello")).toBeNull();
    expect(passFromHash("")).toBeNull();
  });

  it("survives a refresh after the address bar is cleared (same tab)", () => {
    savePass(PASS);
    expect(loadPass()).toBe(PASS);
  });

  it("is forgotten once cleared", () => {
    savePass(PASS);
    clearPass();
    expect(loadPass()).toBeNull();
  });
});
