import { describe, expect, it } from "vitest";
import { isValidName, normalizeName, sanitizeName } from "./attendees";

describe("attendee helpers", () => {
  it("sanitizes blank names and strips angle brackets", () => {
    expect(sanitizeName("   ")).toBe("");
    expect(sanitizeName(" <Ada   Lovelace> ")).toBe("");
    expect(sanitizeName(" <img src=x onerror=alert(1)> Ada   Lovelace ")).toBe("Ada Lovelace");
    expect(sanitizeName(" <script>alert(1)</script> Grace Hopper ")).toBe("Grace Hopper");
  });

  it("normalizes names for duplicate detection", () => {
    expect(normalizeName("  Jean  Smith ")).toBe("jean smith");
  });

  it("limits names to a reasonable length", () => {
    expect(sanitizeName("a".repeat(120))).toHaveLength(80);
  });

  it("rejects numbers and special characters in names", () => {
    expect(isValidName("Gourav Kumar")).toBe(true);
    expect(isValidName("Gourav123")).toBe(false);
    expect(isValidName("Gourav @ Kumar")).toBe(false);
    expect(isValidName("Amit #1")).toBe(false);
  });
});
