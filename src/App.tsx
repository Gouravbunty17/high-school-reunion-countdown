import { Countdown } from "./components/Countdown";
import { DateVote } from "./components/DateVote";
import { Rsvp } from "./components/Rsvp";

const whatsappUrl = "https://chat.whatsapp.com/JFjeldlop2XEuXBUl6OO6R?s=qt&p=a&ilr=4&amv=3";

function App() {
  return (
    <main className="reunion-site">
      <section className="hero" aria-labelledby="main-heading">
        <div className="hero-copy-block">
          <p className="school-kicker">Nehru Children Model School - Batch of 2005-2006</p>
          <h1 id="main-heading">We&apos;re Meeting Again</h1>
          <p className="supporting-message">
            Old friends, unforgettable memories, and one special reunion. The countdown has officially begun.
          </p>

          <div className="hero-actions" aria-label="Primary actions">
            <a className="hero-button primary" href="#rsvp">
              Add My Name
            </a>
            <a className="hero-button secondary" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              Join WhatsApp Group
            </a>
          </div>
        </div>

        <div className="memory-stack" aria-label="School memory photos">
          <figure className="memory-photo photo-one">
            <img
              src="/memories/classroom-laughter.jpg"
              alt="Illustrated classmates smiling together inside a classroom"
            />
            <figcaption>Classroom Laughter</figcaption>
          </figure>
          <figure className="memory-photo photo-two">
            <img
              src="/memories/friends-forever.jpg"
              alt="Illustrated classmates posing together outside Class VIII-B"
            />
            <figcaption>Friends Forever</figcaption>
          </figure>
          <figure className="memory-photo photo-three">
            <img
              src="/memories/schoolyard-memories.jpg"
              alt="Illustrated classmates standing together in the schoolyard"
            />
            <figcaption>Schoolyard Memories</figcaption>
          </figure>
        </div>
      </section>

      <section className="countdown-band" aria-label="Countdown and reunion details">
        <div className="countdown-intro">
          <span>Saturday, December 26, 2026</span>
          <strong>12:00 PM India time</strong>
        </div>
        <Countdown />
        <div className="event-details" aria-label="Event details">
          <span>One-day reunion</span>
          <span>Final day by class vote</span>
          <span>Venue to be announced</span>
        </div>
      </section>

      <section className="reunion-quote" aria-label="Reunion message">
        <p>No matter how far life has taken us, some friendships always bring us back home.</p>
      </section>

      <section className="story-grid" aria-label="Reunion highlights">
        <article>
          <span>01</span>
          <h2>Reconnect</h2>
          <p>See the classmates who shared assemblies, exams, lunch breaks, and the stories we still remember.</p>
        </article>
        <article>
          <span>02</span>
          <h2>Remember</h2>
          <p>Bring back old school moments, photos, nicknames, and the small memories that somehow stayed with us.</p>
        </article>
        <article>
          <span>03</span>
          <h2>Celebrate</h2>
          <p>One day to meet again, laugh freely, and make a new memory for the next chapter of our batch.</p>
        </article>
      </section>

      <div className="section-divider">Confirm your place</div>
      <div id="rsvp">
        <Rsvp />
      </div>

      <div className="section-divider">Choose the reunion day</div>
      <DateVote />

      <section className="memory-preview" aria-label="Upcoming memory features">
        <div>
          <span className="eyebrow">Coming next</span>
          <h2>Memory Wall</h2>
          <p>A simple place for classmates to share school memories, old photos, and messages for the batch.</p>
        </div>
        <div>
          <span className="eyebrow">Coming next</span>
          <h2>Then &amp; Now Gallery</h2>
          <p>Old class pictures and new reunion photos can live together here after the plan is finalized.</p>
        </div>
      </section>

      <footer className="site-footer">Nehru Children Model School - Batch of 2005-2006 - See you again soon.</footer>
    </main>
  );
}

export default App;
