import { Countdown } from "./components/Countdown";
import { DateVote } from "./components/DateVote";
import { Rsvp } from "./components/Rsvp";

const whatsappUrl =
  "https://chat.whatsapp.com/JFjeldlop2XEuXBUl6OO6R?s=qt&p=a&ilr=4&amv=3";

function App() {
  return (
    <main className="reunion-site">
      <style>{`
        .reunion-site { position: relative; overflow: hidden; }
        .reunion-site::before,
        .reunion-site::after {
          content: "";
          position: fixed;
          width: 34rem;
          height: 34rem;
          border-radius: 50%;
          filter: blur(90px);
          opacity: .22;
          pointer-events: none;
          z-index: -1;
        }
        .reunion-site::before { background: #d4af37; top: -14rem; left: -12rem; }
        .reunion-site::after { background: #c15f7b; right: -14rem; bottom: -16rem; }
        .hero-shell {
          min-height: 82vh;
          display: grid;
          place-items: center;
          padding: 4rem 0 2rem;
        }
        .hero-card {
          width: min(1040px, 100%);
          padding: clamp(2rem, 6vw, 5rem);
          border: 1px solid rgba(232,199,106,.22);
          border-radius: 32px;
          background: linear-gradient(145deg, rgba(255,255,255,.10), rgba(255,255,255,.035));
          box-shadow: 0 35px 100px rgba(0,0,0,.34);
          backdrop-filter: blur(24px);
          text-align: center;
        }
        .school-kicker {
          display: inline-flex;
          padding: .7rem 1rem;
          border: 1px solid rgba(232,199,106,.36);
          border-radius: 999px;
          color: #e8c76a;
          background: rgba(7,17,31,.62);
          font-size: .78rem;
          font-weight: 800;
          letter-spacing: .09em;
          text-transform: uppercase;
        }
        .hero-title {
          margin: 1.3rem auto .8rem;
          max-width: 880px;
          color: #f8f2e6;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(3.4rem, 10vw, 7.6rem);
          line-height: .93;
          letter-spacing: -.045em;
        }
        .hero-copy {
          max-width: 700px;
          margin: 0 auto 2rem;
          color: #c8d1dc;
          font-size: clamp(1.05rem, 2.3vw, 1.35rem);
          line-height: 1.7;
        }
        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: .8rem;
          margin-top: 1.5rem;
        }
        .hero-button {
          display: inline-flex;
          min-height: 52px;
          align-items: center;
          justify-content: center;
          padding: 0 1.25rem;
          border-radius: 14px;
          text-decoration: none;
          font-weight: 900;
          transition: transform .18s ease, box-shadow .18s ease;
        }
        .hero-button:hover { transform: translateY(-2px); }
        .hero-button.primary {
          color: #07111f;
          background: linear-gradient(135deg, #d4af37, #f7d774);
          box-shadow: 0 16px 36px rgba(212,175,55,.24);
        }
        .hero-button.secondary {
          color: #f4f1ea;
          border: 1px solid rgba(255,255,255,.18);
          background: rgba(255,255,255,.07);
        }
        .date-pills {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: .65rem;
          margin-top: 1.25rem;
        }
        .date-pills span {
          padding: .58rem .82rem;
          border-radius: 999px;
          color: #e8c76a;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.11);
          font-size: .78rem;
          font-weight: 800;
          letter-spacing: .05em;
          text-transform: uppercase;
        }
        .reunion-quote {
          margin: 1.4rem 0 1.8rem;
          padding: clamp(1.8rem, 5vw, 3.3rem);
          border-radius: 24px;
          text-align: center;
          border: 1px solid rgba(232,199,106,.17);
          background: linear-gradient(135deg, rgba(212,175,55,.09), rgba(255,255,255,.045));
        }
        .reunion-quote p {
          max-width: 820px;
          margin: auto;
          color: #f1dfb2;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(1.45rem, 4vw, 2.65rem);
          line-height: 1.3;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.4rem;
        }
        .info-card {
          padding: 1.35rem;
          border: 1px solid rgba(255,255,255,.13);
          border-radius: 20px;
          background: rgba(255,255,255,.065);
          box-shadow: 0 18px 50px rgba(0,0,0,.18);
        }
        .info-card strong { display: block; color: #e8c76a; margin-bottom: .45rem; }
        .info-card span { color: #c8d1dc; line-height: 1.55; }
        .section-divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 2.1rem 0 1rem;
          color: #e8c76a;
          font-weight: 900;
          letter-spacing: .08em;
          text-transform: uppercase;
          font-size: .8rem;
        }
        .section-divider::before,
        .section-divider::after {
          content: "";
          height: 1px;
          flex: 1;
          background: linear-gradient(90deg, transparent, rgba(232,199,106,.36), transparent);
        }
        .coming-soon {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-top: 1.4rem;
        }
        .future-card {
          min-height: 180px;
          padding: 1.6rem;
          border-radius: 22px;
          border: 1px solid rgba(255,255,255,.12);
          background: rgba(255,255,255,.055);
        }
        .future-card h3 { margin: 0 0 .65rem; color: #f4f1ea; font-size: 1.45rem; }
        .future-card p { color: #c8d1dc; line-height: 1.6; }
        .site-footer {
          padding: 2.5rem 0 .5rem;
          text-align: center;
          color: #aeb9c8;
        }
        @media (max-width: 760px) {
          .hero-shell { min-height: auto; padding-top: 1rem; }
          .hero-card { border-radius: 24px; }
          .info-grid, .coming-soon { grid-template-columns: 1fr; }
          .hero-actions { flex-direction: column; }
          .hero-button { width: 100%; }
        }
      `}</style>

      <section className="hero-shell" aria-labelledby="main-heading">
        <div className="hero-card">
          <div className="school-kicker">Nehru Children Model School · Batch of 2004–2005</div>
          <h1 className="hero-title" id="main-heading">We&apos;re Meeting Again</h1>
          <p className="hero-copy">
            Twenty-two years later, old friends, unforgettable memories, and one beautiful reunion are bringing us back together.
          </p>

          <Countdown />

          <div className="date-pills" aria-label="Reunion details">
            <span>December 26 or 27, 2026</span>
            <span>Final date by class vote</span>
            <span>Venue to be announced</span>
          </div>

          <div className="hero-actions">
            <a className="hero-button primary" href="#rsvp">Add My Name</a>
            <a
              className="hero-button secondary"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Join WhatsApp Group
            </a>
          </div>
        </div>
      </section>

      <section className="reunion-quote" aria-label="Reunion message">
        <p>Some friendships never fade. They simply wait for the next reunion.</p>
      </section>

      <section className="info-grid" aria-label="Reunion information">
        <article className="info-card">
          <strong>Reconnect</strong>
          <span>Meet the classmates who shared the classrooms, laughter, and memories that shaped us.</span>
        </article>
        <article className="info-card">
          <strong>Support</strong>
          <span>Use our class network to help each other mentally, professionally, and personally.</span>
        </article>
        <article className="info-card">
          <strong>Celebrate</strong>
          <span>One day to revisit old stories and create memories that carry us into the years ahead.</span>
        </article>
      </section>

      <div className="section-divider">Confirm your place</div>
      <div id="rsvp"><Rsvp /></div>

      <div className="section-divider">Choose the reunion day</div>
      <DateVote />

      <section className="coming-soon" aria-label="Upcoming reunion features">
        <article className="future-card">
          <h3>Memory Wall</h3>
          <p>A space for classmates to share their favourite school memories, stories, and messages for the batch.</p>
        </article>
        <article className="future-card">
          <h3>Then &amp; Now Gallery</h3>
          <p>Old class photographs, school events, and new pictures from classmates will live here soon.</p>
        </article>
      </section>

      <footer className="site-footer">
        Nehru Children Model School · Batch of 2004–2005 · See you again ❤️
      </footer>
    </main>
  );
}

export default App;
