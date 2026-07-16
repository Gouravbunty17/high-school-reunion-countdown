import { describe, expect, it } from "vitest";
import { countVotes, DATE_OPTIONS, isDateOptionId } from "./dateVotes";

describe("date vote helpers", () => {
  it("validates known date option IDs", () => {
    expect(isDateOptionId("dec-26")).toBe(true);
    expect(isDateOptionId("both-days")).toBe(true);
    expect(isDateOptionId("weekend-after")).toBe(false);
  });

  it("counts votes for every option", () => {
    const counts = countVotes([
      {
        id: "1",
        name: "A",
        normalized_name: "a",
        date_option: "dec-26",
        created_at: "2026-01-01T00:00:00Z",
      },
      {
        id: "2",
        name: "B",
        normalized_name: "b",
        date_option: "both-days",
        created_at: "2026-01-01T00:00:00Z",
      },
    ]);

    expect(counts).toEqual({
      "dec-26": 1,
      "dec-27": 0,
      "both-days": 1,
    });
    expect(Object.keys(counts)).toHaveLength(DATE_OPTIONS.length);
  });
});
