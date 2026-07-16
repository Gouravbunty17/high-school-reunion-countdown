import { describe, expect, it } from "vitest";
import { normalizeName, sanitizeName } from "./attendees";

describe("attendee helpers", () => {
  it("sanitizes blank names and strips angle brackets", () => {
    expect(sanitizeName("   ")).toBe("");
    expect(sanitizeName(" <Ada   Lovelace> ")).toBe("Ada Lovelace");
  });

  it("normalizes names for duplicate detection", () => {
    expect(normalizeName("  Jean  Smith ")).toBe("jean smith");
  });

  it("limits names to a reasonable length", () => {
    expect(sanitizeName("a".repeat(120))).toHaveLength(80);
  });
});
