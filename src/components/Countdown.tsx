import { useEffect, useMemo, useState } from "react";
import { formatCountdownValue, getCountdownParts, REUNION_TARGET_ISO } from "../lib/countdown";

const countdownLabels = ["Days", "Hours", "Minutes", "Seconds"] as const;

export function Countdown() {
  const target = useMemo(() => new Date(REUNION_TARGET_ISO), []);
  const [parts, setParts] = useState(() => getCountdownParts(new Date(), target));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setParts(getCountdownParts(new Date(), target));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [target]);

  const values = [parts.days, parts.hours, parts.minutes, parts.seconds];

  if (parts.isComplete) {
    return (
      <div className="complete-message" role="status" aria-live="polite">
        The wait is over — reunion time! 🎉
      </div>
    );
  }

  return (
    <section className="countdown" aria-label="Countdown to the reunion">
      {countdownLabels.map((label, index) => (
        <article className="count-card" key={label}>
          <span className="count-value">{formatCountdownValue(values[index])}</span>
          <span className="count-label">{label}</span>
        </article>
      ))}
    </section>
  );
}
