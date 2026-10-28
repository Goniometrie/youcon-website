-- Inschrijven voor activiteiten door ingelogde gebruikers, met een optioneel
-- maximum aantal deelnemers. Alleen het bestuur ziet wie er komt; bezoekers
-- zien hooguit hoeveel plekken er nog zijn.
-- Toegepast op het Supabase-project "youcon-website" (eu-central-1).

-- Null means no maximum.
alter table public.activities
  add column capacity integer check (capacity > 0);

create table public.registrations (
  activity_id uuid not null references public.activities (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade
    default auth.uid(),
  created_at timestamptz not null default now(),
  primary key (activity_id, profile_id)
);

create index registrations_profile_id_idx on public.registrations (profile_id);

alter table public.registrations enable row level security;

create policy "Users read their own registrations; staff read all"
  on public.registrations for select to authenticated
  using (profile_id = (select auth.uid()) or (select private.is_staff()));

create policy "Users register themselves"
  on public.registrations for insert to authenticated
  with check (profile_id = (select auth.uid()));

create policy "Users cancel their own registration before the day"
  on public.registrations for delete to authenticated
  using (
    profile_id = (select auth.uid())
    and exists (
      select 1 from public.activities a
      where a.id = activity_id and a.date >= (now() at time zone 'Europe/Amsterdam')::date
    )
  );

-- Checks every new registration against the activity. Locks the activity row,
-- so two people can't take the last spot at the same time. Security definer
-- to count everyone's registrations, not only the caller's.
create function private.check_registration()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  activity public.activities;
begin
  select * into activity from public.activities
  where id = new.activity_id
  for update;

  if not found
    or not activity.published
    or activity.registration_url is not null
    or activity.date < (now() at time zone 'Europe/Amsterdam')::date then
    raise exception 'registration_closed' using errcode = 'P0001';
  end if;

  if activity.capacity is not null and (
    select count(*) from public.registrations where activity_id = new.activity_id
  ) >= activity.capacity then
    raise exception 'activity_full' using errcode = 'P0001';
  end if;

  return new;
end;
$$;

revoke execute on function private.check_registration() from public, anon, authenticated;

create trigger registrations_check
  before insert on public.registrations
  for each row execute function private.check_registration();

-- Number of registrations per published activity, for "nog 5 plekken" and
-- "vol". Counts only, no names, so anyone may call it.
create function public.registration_counts()
returns table (activity_id uuid, count integer)
language sql
stable
security definer
set search_path = ''
as $$
  select r.activity_id, count(*)::integer
  from public.registrations r
  join public.activities a on a.id = r.activity_id
  where a.published
  group by r.activity_id;
$$;

grant execute on function public.registration_counts() to anon, authenticated;
