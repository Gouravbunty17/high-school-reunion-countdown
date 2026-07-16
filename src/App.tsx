import { Countdown } from "./components/Countdown";
import { DateVote } from "./components/DateVote";
import { Rsvp } from "./components/Rsvp";

function App() {
  return (
    <main>
      <section className="hero" aria-labelledby="main-heading">
        <div className="reunion-badge">Nehru Children Model School — Batch of 2004–2005</div>
        <h1 id="main-heading">We&apos;re Meeting Again</h1>
        <p className="supporting-message">
          Old friends, unforgettable memories, and one special reunion. The countdown has officially begun.
        </p>

        <Countdown />

        <div className="event-details" aria-label="Event details">
          <span>Saturday-Sunday, December 26-27, 2026</span>
          <span>Countdown to Saturday, Dec 26, 2026 at 6:00 PM Toronto time</span>
        </div>
      </section>

      <section className="memory-band" aria-label="Reunion message">
        <p>No matter how far life has taken us, some friendships always bring us back home.</p>
      </section>

      <Rsvp />
      <DateVote />
    </main>
  );
}

export default App;
