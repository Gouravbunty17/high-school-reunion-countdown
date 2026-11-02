-- Run once in Supabase SQL Editor. Submissions require approval before public display.
create table if not exists public.reunion_memories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 80),
  memory text not null check (char_length(trim(memory)) between 10 and 500),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.reunion_memories enable row level security;
revoke all on public.reunion_memories from anon, authenticated;
grant select (id, name, memory, created_at) on public.reunion_memories to anon, authenticated;
grant insert (name, memory) on public.reunion_memories to anon, authenticated;
drop policy if exists "Public can read approved memories" on public.reunion_memories;
create policy "Public can read approved memories" on public.reunion_memories for select to anon, authenticated using (approved = true);
drop policy if exists "Public can submit memories for review" on public.reunion_memories;
create policy "Public can submit memories for review" on public.reunion_memories for insert to anon, authenticated with check (approved = false);
-- To approve a memory, use Table Editor and set approved=true for the appropriate row.
