import { describe, expect, it } from "vitest";
import { accountNameSchema } from "./accountName";

describe("registration names", () => {
  it("requires First Name", () => {
    expect(accountNameSchema.safeParse({ first_name: "  ", last_name: "" }).success).toBe(false);
  });
  it("allows optional Last Name and saves trimmed names", () => {
    expect(accountNameSchema.parse({ first_name: " Jane ", last_name: "" })).toEqual({ first_name: "Jane", last_name: "" });
    expect(accountNameSchema.parse({ first_name: " Jane ", last_name: " Doe " }).last_name).toBe("Doe");
  });
});