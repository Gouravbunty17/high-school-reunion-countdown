import { describe, expect, it } from "vitest";
import { formatCountdownValue, getCountdownParts } from "./countdown";

describe("countdown", () => {
  it("calculates days, hours, minutes, and seconds before the reunion", () => {
    const result = getCountdownParts(
      new Date("2026-12-25T12:30:15+05:30"),
      new Date("2026-12-26T12:00:00+05:30"),
    );

    expect(result).toEqual({
      days: 0,
      hours: 23,
      minutes: 29,
      seconds: 45,
      isComplete: false,
    });
  });

  it("marks the countdown complete after the target date", () => {
    const result = getCountdownParts(
      new Date("2026-12-26T12:00:01+05:30"),
      new Date("2026-12-26T12:00:00+05:30"),
    );

    expect(result).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isComplete: true,
    });
  });

  it("formats values as two digits", () => {
    expect(formatCountdownValue(7)).toBe("07");
    expect(formatCountdownValue(12)).toBe("12");
  });
});
