-- PROJETO ITÁLIA 2027 — SUPABASE
-- Execute este SQL no SQL Editor do Supabase.

create table if not exists public.projects (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;

drop policy if exists "users can read own project" on public.projects;
create policy "users can read own project"
on public.projects for select
using (auth.uid() = user_id);

drop policy if exists "users can insert own project" on public.projects;
create policy "users can insert own project"
on public.projects for insert
with check (auth.uid() = user_id);

drop policy if exists "users can update own project" on public.projects;
create policy "users can update own project"
on public.projects for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Opcional: atualização automática do timestamp.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();
