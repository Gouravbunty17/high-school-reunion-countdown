import { FormEvent, useEffect, useMemo, useState } from "react";
import { addAttendee, Attendee, fetchAttendees, normalizeName, sanitizeName } from "../lib/attendees";

type Notice = {
  type: "success" | "error";
  message: string;
};

export function Rsvp() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [name, setName] = useState("");
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const existingNames = useMemo(
    () => new Set(attendees.map((attendee) => attendee.normalized_name)),
    [attendees],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadAttendees() {
      try {
        const loadedAttendees = await fetchAttendees();
        if (isMounted) {
          setAttendees(loadedAttendees);
          setNotice(null);
        }
      } catch (error) {
        if (isMounted) {
          setNotice({
            type: "error",
            message: error instanceof Error ? error.message : "We could not load the attendee list.",
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadAttendees();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const sanitizedName = sanitizeName(name);
    const normalizedName = normalizeName(sanitizedName);

    if (!sanitizedName) {
      setNotice({ type: "error", message: "Please enter your name before joining the list." });
      return;
    }

    if (existingNames.has(normalizedName)) {
      setNotice({ type: "error", message: `${sanitizedName} is already on the list.` });
      return;
    }

    setIsSubmitting(true);
    setNotice(null);

    const result = await addAttendee(sanitizedName);

    if (result.ok) {
      setAttendees((currentAttendees) => [...currentAttendees, result.attendee]);
      setName("");
      setNotice({ type: "success", message: `${result.attendee.name} is confirmed. We cannot wait to see you.` });
    } else {
      setNotice({ type: "error", message: result.message });
    }

    setIsSubmitting(false);
  }

  return (
    <section className="rsvp-panel" aria-labelledby="rsvp-heading">
      <div className="section-heading">
        <p className="eyebrow">RSVP</p>
        <h2 id="rsvp-heading">Who&apos;s Joining Us?</h2>
        <p>Tell the class you are coming and watch the list grow in real time.</p>
      </div>

      <form className="rsvp-form" onSubmit={handleSubmit}>
        <label htmlFor="attendee-name">Your name</label>
        <div className="input-row">
          <input
            id="attendee-name"
            name="attendee-name"
            autoComplete="name"
            maxLength={80}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter your full name"
            disabled={isSubmitting}
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "I'm Coming"}
          </button>
        </div>
      </form>

      {notice ? (
        <p className={`notice ${notice.type}`} role="status" aria-live="polite">
          {notice.message}
        </p>
      ) : null}

      <div className="attendee-summary">
        <strong>{attendees.length}</strong>
        <span>{attendees.length === 1 ? "confirmed attendee" : "confirmed attendees"}</span>
      </div>

      <div className="attendee-list" aria-live="polite">
        {isLoading ? (
          <p className="muted">Loading classmates...</p>
        ) : attendees.length > 0 ? (
          <ul>
            {attendees.map((attendee) => (
              <li key={attendee.id}>{attendee.name}</li>
            ))}
          </ul>
        ) : (
          <p className="muted">No classmates have RSVP&apos;d yet. You can be first.</p>
        )}
      </div>
    </section>
  );
}
