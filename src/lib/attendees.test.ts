import { describe, expect, it } from "vitest";
import { getReturnedAttendee, isValidName, isVisibleAttendee, normalizeName, sanitizeName } from "./attendees";

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

  it("reads inserted attendees from Supabase response formats", () => {
    const attendee = {
      id: "1",
      name: "Gourav Kumar",
      normalized_name: "gourav kumar",
      created_at: "2026-01-01T00:00:00Z",
    };

    expect(getReturnedAttendee([attendee])).toEqual(attendee);
    expect(getReturnedAttendee({ data: [attendee], error: null })).toEqual(attendee);
  });

  it("hides accidental system probe rows", () => {
    expect(
      isVisibleAttendee({
        id: "probe",
        name: "Codex Probe",
        normalized_name: "codex probe",
        created_at: "2026-01-01T00:00:00Z",
      }),
    ).toBe(false);
  });
});
