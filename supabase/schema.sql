create extension if not exists pgcrypto;

create table if not exists public.responses (
  id text primary key,
  ts text not null,
  payload jsonb not null,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.responses
alter column id type text using id::text;

alter table public.responses enable row level security;

drop policy if exists "responses_are_readable_by_everyone" on public.responses;
drop policy if exists "responses_are_insertable_by_everyone" on public.responses;

create policy "responses_are_readable_by_everyone"
on public.responses
for select
to anon
using (true);

create policy "responses_are_insertable_by_everyone"
on public.responses
for insert
to anon
with check (
  jsonb_typeof(payload) = 'object'
  and jsonb_typeof(payload->'id') = 'string'
  and jsonb_typeof(payload->'ts') = 'string'
  and (not (payload ? 'coletor') or jsonb_typeof(payload->'coletor') = 'string')
  and (not (payload ? 'nome') or jsonb_typeof(payload->'nome') = 'string')
  and (not (payload ? 'idade') or jsonb_typeof(payload->'idade') = 'string')
  and (not (payload ? 'games') or jsonb_typeof(payload->'games') = 'string')
  and (not (payload ? 'fin') or jsonb_typeof(payload->'fin') = 'string')
  and (not (payload ? 'recom') or jsonb_typeof(payload->'recom') = 'string')
  and (not (payload ? 'aprendeu') or jsonb_typeof(payload->'aprendeu') = 'string')
  and (not (payload ? 'travou') or jsonb_typeof(payload->'travou') = 'string')
  and (not (payload ? 'gostou') or jsonb_typeof(payload->'gostou') = 'string')
  and (not (payload ? 'melhoria') or jsonb_typeof(payload->'melhoria') = 'string')
  and (not (payload ? 'onde') or jsonb_typeof(payload->'onde') = 'string')
  and (not (payload ? 'nota') or jsonb_typeof(payload->'nota') = 'number')
);
