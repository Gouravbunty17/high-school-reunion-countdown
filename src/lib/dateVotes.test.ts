import { describe, expect, it } from "vitest";
import { countVotes, DATE_OPTIONS, getReturnedDateVote, isDateOptionId } from "./dateVotes";

describe("date vote helpers", () => {
  it("validates known date option IDs", () => {
    expect(isDateOptionId("dec-26")).toBe(true);
    expect(isDateOptionId("dec-27")).toBe(true);
    expect(isDateOptionId("both-days")).toBe(false);
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
        date_option: "dec-27",
        created_at: "2026-01-01T00:00:00Z",
      },
    ]);

    expect(counts).toEqual({
      "dec-26": 1,
      "dec-27": 1,
    });
    expect(Object.keys(counts)).toHaveLength(DATE_OPTIONS.length);
  });

  it("reads inserted votes from Supabase response formats", () => {
    const vote = {
      id: "1",
      name: "Gourav Kumar",
      normalized_name: "gourav kumar",
      date_option: "dec-26" as const,
      created_at: "2026-01-01T00:00:00Z",
    };

    expect(getReturnedDateVote([vote])).toEqual(vote);
    expect(getReturnedDateVote({ data: [vote], error: null })).toEqual(vote);
  });
});
