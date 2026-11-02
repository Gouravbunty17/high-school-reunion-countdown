import { FormEvent, useEffect, useState } from "react";

type Memory = { id: string; name: string; memory: string; created_at: string };
const url = (import.meta.env.VITE_SUPABASE_URL || "https://pacmnqhmfhmsvlvpcynq.supabase.co").replace(/\/$/, "");
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_hS9HcfC5hlG43QVfdP0xlA_4tXeFRyF";
const endpoint = url + "/rest/v1/reunion_memories";
const headers = { apikey: key, Authorization: "Bearer " + key, "Content-Type": "application/json" };

export function MemoryWall() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [name, setName] = useState("");
  const [memory, setMemory] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(endpoint + "?select=id,name,memory,created_at&approved=eq.true&order=created_at.desc&limit=100", { headers })
      .then(async r => { if (!r.ok) throw new Error("unavailable"); return r.json() as Promise<Memory[]>; })
      .then(data => { if (active) setMemories(data); })
      .catch(() => { if (active) { setError(true); setNotice("The memory wall is being set up. Please check back soon."); } });
    return () => { active = false; };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const cleanName = name.trim().replace(/\s+/g, " ");
    const cleanMemory = memory.trim().replace(/\s+/g, " ");
    if (cleanName.length < 2 || cleanName.length > 80 || cleanMemory.length < 10 || cleanMemory.length > 500) {
      setNotice("Please enter your name and a memory between 10 and 500 characters.");
      return;
    }
    setBusy(true);
    setNotice("");
    try {
      const r = await fetch(endpoint, { method: "POST", headers, body: JSON.stringify({ name: cleanName, memory: cleanMemory }) });
      if (!r.ok) throw new Error("save failed");
      setName(""); setMemory("");
      setNotice("Thank you! Your memory was submitted and will appear after review.");
    } catch {
      setNotice("Could not submit your memory right now. Please try again later.");
    } finally { setBusy(false); }
  }

  return (
    <section className="memory-wall" id="memories" aria-labelledby="memory-wall-heading">
      <div className="memory-wall-heading">
        <p className="eyebrow">Our stories · Batch 2005–2006</p>
        <h2 id="memory-wall-heading">The Memory Wall</h2>
        <p>Remember a funny classroom moment, a teacher's saying, or an old nickname? Share it with the class. No photographs needed.</p>
      </div>
      <form className="memory-form" onSubmit={submit}>
        <label htmlFor="memory-name">Your name</label>
        <input id="memory-name" value={name} onChange={e => setName(e.target.value)} maxLength={80} required placeholder="Your name" />
        <label htmlFor="memory-text">Your school memory</label>
        <textarea id="memory-text" value={memory} onChange={e => setMemory(e.target.value)} maxLength={500} minLength={10} rows={4} required placeholder="I still remember when..." />
        <div className="memory-form-footer"><span>{memory.length}/500</span><button disabled={busy || error} type="submit">{busy ? "Submitting..." : "Share a memory"}</button></div>
        {notice && <p className="muted" role="status">{notice}</p>}
      </form>
      <div className="memory-cards" aria-live="polite">
        {memories.length ? memories.map(item => (
          <article className="memory-note" key={item.id}>
            <span className="memory-quote" aria-hidden="true">“</span>
            <p>{item.memory}</p>
            <footer>— {item.name}</footer>
          </article>
        )) : <p className="memory-empty">Our memory book is waiting for its first story. ✨</p>}
      </div>
    </section>
  );
}
