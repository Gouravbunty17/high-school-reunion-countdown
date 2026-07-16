import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  countVotes,
  DateOptionId,
  DATE_OPTIONS,
  DateVote as DateVoteRecord,
  fetchDateVotes,
  submitDateVote,
} from "../lib/dateVotes";

type VoteNotice = {
  type: "success" | "error";
  message: string;
};

export function DateVote() {
  const [votes, setVotes] = useState<DateVoteRecord[]>([]);
  const [name, setName] = useState("");
  const [dateOption, setDateOption] = useState<DateOptionId>("dec-26");
  const [notice, setNotice] = useState<VoteNotice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const voteCounts = useMemo(() => countVotes(votes), [votes]);

  useEffect(() => {
    let isMounted = true;

    async function loadVotes() {
      try {
        const loadedVotes = await fetchDateVotes();
        if (isMounted) {
          setVotes(loadedVotes);
          setNotice(null);
        }
      } catch (error) {
        if (isMounted) {
          setNotice({
            type: "error",
            message: error instanceof Error ? error.message : "We could not load the date votes.",
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadVotes();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setNotice(null);

    const result = await submitDateVote(name, dateOption);

    if (result.ok) {
      setVotes((currentVotes) => [...currentVotes, result.vote]);
      setName("");
      setNotice({ type: "success", message: `Thanks, ${result.vote.name}. Your date vote is counted.` });
    } else {
      setNotice({ type: "error", message: result.message });
    }

    setIsSubmitting(false);
  }

  return (
    <section className="vote-panel" aria-labelledby="date-vote-heading">
      <div className="section-heading">
        <p className="eyebrow">Date Vote</p>
        <h2 id="date-vote-heading">Which Date Works Best?</h2>
        <p>Help us choose the one reunion day that works better for most classmates.</p>
      </div>

      <form className="vote-form" onSubmit={handleSubmit}>
        <label htmlFor="voter-name">Your name</label>
        <input
          id="voter-name"
          name="voter-name"
          autoComplete="name"
          maxLength={80}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter your full name"
          disabled={isSubmitting}
        />

        <fieldset>
          <legend>Choose one option</legend>
          <div className="vote-options">
            {DATE_OPTIONS.map((option) => (
              <label className="vote-option" key={option.id}>
                <input
                  type="radio"
                  name="date-option"
                  value={option.id}
                  checked={dateOption === option.id}
                  onChange={() => setDateOption(option.id)}
                  disabled={isSubmitting}
                />
                <span>
                  <strong>{option.label}</strong>
                  <small>{option.detail}</small>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving Vote..." : "Vote for Date"}
        </button>
      </form>

      {notice ? (
        <p className={`notice ${notice.type}`} role="status" aria-live="polite">
          {notice.message}
        </p>
      ) : null}

      <div className="vote-results" aria-live="polite">
        {isLoading ? (
          <p className="muted">Loading date votes...</p>
        ) : (
          DATE_OPTIONS.map((option) => (
            <div className="vote-result" key={option.id}>
              <span>{option.label}</span>
              <strong>{voteCounts[option.id]}</strong>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
