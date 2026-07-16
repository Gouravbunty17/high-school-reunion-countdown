import { normalizeName, sanitizeName, SupabaseError } from "./attendees";

export const DATE_OPTIONS = [
  { id: "dec-26", label: "Saturday, December 26, 2026", detail: "Opening evening" },
  { id: "dec-27", label: "Sunday, December 27, 2026", detail: "Weekend daytime" },
] as const;

export type DateOptionId = (typeof DATE_OPTIONS)[number]["id"];

export type DateVote = {
  id: string;
  name: string;
  normalized_name: string;
  date_option: DateOptionId;
  created_at: string;
};

export type DateVoteResult =
  | { ok: true; vote: DateVote }
  | { ok: false; message: string };

type DateVoteListResponse = {
  data: DateVote[] | null;
  error: SupabaseError | null;
};

type DateVoteInsertResponse = {
  data: DateVote[] | null;
  error: SupabaseError | null;
};

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const DATE_VOTES_TABLE = import.meta.env.VITE_SUPABASE_DATE_VOTES_TABLE || "reunion_date_votes";
const LOCAL_DATE_VOTES_KEY = "nehru-reunion-local-date-votes";

export function isDateOptionId(value: string): value is DateOptionId {
  return DATE_OPTIONS.some((option) => option.id === value);
}

export function countVotes(votes: DateVote[]): Record<DateOptionId, number> {
  return DATE_OPTIONS.reduce(
    (counts, option) => ({
      ...counts,
      [option.id]: votes.filter((vote) => vote.date_option === option.id).length,
    }),
    {} as Record<DateOptionId, number>,
  );
}

function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

function getHeaders(): HeadersInit {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
}

function getTableUrl(query = ""): string {
  return `${SUPABASE_URL}/rest/v1/${DATE_VOTES_TABLE}${query}`;
}

function readLocalVotes(): DateVote[] {
  try {
    const savedVotes = window.localStorage.getItem(LOCAL_DATE_VOTES_KEY);
    return savedVotes ? (JSON.parse(savedVotes) as DateVote[]) : [];
  } catch {
    return [];
  }
}

function writeLocalVotes(votes: DateVote[]): void {
  window.localStorage.setItem(LOCAL_DATE_VOTES_KEY, JSON.stringify(votes));
}

function createLocalVote(name: string, normalizedName: string, dateOption: DateOptionId): DateVote {
  return {
    id: window.crypto.randomUUID(),
    name,
    normalized_name: normalizedName,
    date_option: dateOption,
    created_at: new Date().toISOString(),
  };
}

export async function fetchDateVotes(): Promise<DateVote[]> {
  if (!isSupabaseConfigured()) {
    return readLocalVotes();
  }

  const response = await fetch(getTableUrl("?select=id,name,normalized_name,date_option,created_at&order=created_at.asc"), {
    headers: getHeaders(),
  });
  const payload = (await response.json()) as DateVoteListResponse | DateVote[];

  if (!response.ok || ("error" in payload && payload.error)) {
    throw new Error("We could not load the date votes. Please try again in a moment.");
  }

  return Array.isArray(payload) ? payload : payload.data ?? [];
}

export async function submitDateVote(rawName: string, dateOption: DateOptionId): Promise<DateVoteResult> {
  const name = sanitizeName(rawName);
  const normalizedName = normalizeName(name);

  if (!name) {
    return { ok: false, message: "Please enter your name before voting." };
  }

  if (!isDateOptionId(dateOption)) {
    return { ok: false, message: "Please choose a reunion date option." };
  }

  if (!isSupabaseConfigured()) {
    const existingVotes = readLocalVotes();
    const existingVote = existingVotes.find((vote) => vote.normalized_name === normalizedName);

    if (existingVote) {
      return { ok: false, message: `${name} has already voted for a date.` };
    }

    const vote = createLocalVote(name, normalizedName, dateOption);
    writeLocalVotes([...existingVotes, vote]);
    return { ok: true, vote };
  }

  const response = await fetch(getTableUrl(), {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ name, normalized_name: normalizedName, date_option: dateOption }),
  });
  const payload = (await response.json()) as DateVoteInsertResponse | SupabaseError;

  if (!response.ok) {
    if ("code" in payload && payload.code === "23505") {
      return { ok: false, message: `${name} has already voted for a date.` };
    }

    return { ok: false, message: "We could not save your date vote just now. Please try again." };
  }

  const vote = Array.isArray((payload as DateVoteInsertResponse).data)
    ? (payload as DateVoteInsertResponse).data?.[0]
    : undefined;

  if (!vote) {
    return { ok: false, message: "Your vote was received, but the results could not refresh." };
  }

  return { ok: true, vote };
}
