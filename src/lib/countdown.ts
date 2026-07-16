export type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
};

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export const REUNION_TARGET_ISO = "2026-12-26T12:00:00+05:30";

export function getCountdownParts(now: Date, target: Date): CountdownParts {
  const remaining = Math.max(target.getTime() - now.getTime(), 0);

  return {
    days: Math.floor(remaining / DAY),
    hours: Math.floor((remaining % DAY) / HOUR),
    minutes: Math.floor((remaining % HOUR) / MINUTE),
    seconds: Math.floor((remaining % MINUTE) / SECOND),
    isComplete: remaining === 0,
  };
}

export function formatCountdownValue(value: number): string {
  return value.toString().padStart(2, "0");
}
