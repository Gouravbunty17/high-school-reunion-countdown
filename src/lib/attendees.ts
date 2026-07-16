export type Attendee = {
  id: string;
  name: string;
  normalized_name: string;
  created_at: string;
};

export type AttendeeResult =
  | { ok: true; attendee: Attendee }
  | { ok: false; message: string };

export type SupabaseError = {
  code?: string;
  message?: string;
};

export type SupabaseListResponse = {
  data: Attendee[] | null;
  error: SupabaseError | null;
};

export type SupabaseInsertResponse = {
  data: Attendee[] | null;
  error: SupabaseError | null;
};

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const ATTENDEES_TABLE = import.meta.env.VITE_SUPABASE_ATTENDEES_TABLE || "reunion_attendees";
const LOCAL_ATTENDEES_KEY = "nehru-reunion-local-attendees";

export function sanitizeName(value: string): string {
  return value
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

export function normalizeName(value: string): string {
  return sanitizeName(value).toLocaleLowerCase("en-US");
}

export function getSupabaseConfigStatus(): { isConfigured: boolean; message?: string } {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return {
      isConfigured: false,
      message: "RSVP storage is not configured yet. Add the Supabase environment variables in Vercel.",
    };
  }

  return { isConfigured: true };
}

function readLocalAttendees(): Attendee[] {
  try {
    const savedAttendees = window.localStorage.getItem(LOCAL_ATTENDEES_KEY);
    return savedAttendees ? (JSON.parse(savedAttendees) as Attendee[]) : [];
  } catch {
    return [];
  }
}

function writeLocalAttendees(attendees: Attendee[]): void {
  window.localStorage.setItem(LOCAL_ATTENDEES_KEY, JSON.stringify(attendees));
}

function createLocalAttendee(name: string, normalizedName: string): Attendee {
  return {
    id: window.crypto.randomUUID(),
    name,
    normalized_name: normalizedName,
    created_at: new Date().toISOString(),
  };
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
  return `${SUPABASE_URL}/rest/v1/${ATTENDEES_TABLE}${query}`;
}

export async function fetchAttendees(): Promise<Attendee[]> {
  const config = getSupabaseConfigStatus();
  if (!config.isConfigured) {
    return readLocalAttendees();
  }

  const response = await fetch(getTableUrl("?select=id,name,normalized_name,created_at&order=created_at.asc"), {
    headers: getHeaders(),
  });
  const payload = (await response.json()) as SupabaseListResponse | Attendee[];

  if (!response.ok || ("error" in payload && payload.error)) {
    throw new Error("We could not load the attendee list. Please try again in a moment.");
  }

  return Array.isArray(payload) ? payload : payload.data ?? [];
}

export async function addAttendee(rawName: string): Promise<AttendeeResult> {
  const name = sanitizeName(rawName);
  const normalizedName = normalizeName(name);

  if (!name) {
    return { ok: false, message: "Please enter your name before joining the list." };
  }

  const config = getSupabaseConfigStatus();
  if (!config.isConfigured) {
    const existingAttendees = readLocalAttendees();
    const isDuplicate = existingAttendees.some((attendee) => attendee.normalized_name === normalizedName);

    if (isDuplicate) {
      return { ok: false, message: `${name} is already on the list.` };
    }

    const attendee = createLocalAttendee(name, normalizedName);
    writeLocalAttendees([...existingAttendees, attendee]);

    return { ok: true, attendee };
  }

  const response = await fetch(getTableUrl(), {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ name, normalized_name: normalizedName }),
  });
  const payload = (await response.json()) as SupabaseInsertResponse | SupabaseError;

  if (!response.ok) {
    if ("code" in payload && payload.code === "23505") {
      return { ok: false, message: `${name} is already on the list.` };
    }

    return {
      ok: false,
      message: "We could not save your RSVP just now. Please try again.",
    };
  }

  const attendee = Array.isArray((payload as SupabaseInsertResponse).data)
    ? (payload as SupabaseInsertResponse).data?.[0]
    : undefined;

  if (!attendee) {
    return { ok: false, message: "Your RSVP was received, but the attendee list could not refresh." };
  }

  return { ok: true, attendee };
}
