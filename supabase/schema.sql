create extension if not exists pgcrypto;

create table if not exists public.reunion_attendees (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 80),
  normalized_name text not null unique check (char_length(trim(normalized_name)) between 1 and 80),
  created_at timestamptz not null default now()
);

alter table public.reunion_attendees enable row level security;

drop policy if exists "Anyone can read reunion attendees" on public.reunion_attendees;
create policy "Anyone can read reunion attendees"
on public.reunion_attendees
for select
to anon
using (true);

drop policy if exists "Anyone can RSVP with a name" on public.reunion_attendees;
create policy "Anyone can RSVP with a name"
on public.reunion_attendees
for insert
to anon
with check (
  name = trim(name)
  and normalized_name = lower(normalized_name)
  and char_length(name) between 1 and 80
  and char_length(normalized_name) between 1 and 80
);

create table if not exists public.reunion_date_votes (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 80),
  normalized_name text not null unique check (char_length(trim(normalized_name)) between 1 and 80),
  date_option text not null check (date_option in ('dec-26', 'dec-27', 'both-days')),
  created_at timestamptz not null default now()
);

alter table public.reunion_date_votes enable row level security;

drop policy if exists "Anyone can read reunion date votes" on public.reunion_date_votes;
create policy "Anyone can read reunion date votes"
on public.reunion_date_votes
for select
to anon
using (true);

drop policy if exists "Anyone can vote for a reunion date" on public.reunion_date_votes;
create policy "Anyone can vote for a reunion date"
on public.reunion_date_votes
for insert
to anon
with check (
  name = trim(name)
  and normalized_name = lower(normalized_name)
  and char_length(name) between 1 and 80
  and char_length(normalized_name) between 1 and 80
  and date_option in ('dec-26', 'dec-27', 'both-days')
);
