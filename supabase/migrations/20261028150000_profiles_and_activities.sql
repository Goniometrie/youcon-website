-- Profielen met rollen, activiteiten en een fotomap voor activiteiten.
-- Toegepast op het Supabase-project "youcon-website" (eu-central-1).

-- Security definer helpers live outside the exposed API schema.
create schema if not exists private;
grant usage on schema private to anon, authenticated;

-- Roles: members can sign in later; board and admin manage content.
create type public.app_role as enum ('member', 'board', 'admin');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role public.app_role not null default 'member',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Every new auth user gets a profile with the default role.
create function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

revoke execute on function private.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

-- True when the signed-in user is board or admin. Security definer so RLS
-- policies can call it without recursing into the profiles policies.
create function private.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role in ('board', 'admin')
  );
$$;

grant execute on function private.is_staff() to anon, authenticated;

create policy "Users read their own profile; staff read all"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select private.is_staff()));

-- No insert/update/delete policies: roles change only via the dashboard or SQL.

create type public.activity_type as enum ('excursion', 'theme-evening', 'event');

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  type public.activity_type not null,
  date date not null,
  time time,
  location text not null,
  partner text,
  english_spoken boolean not null default false,
  registration_url text,
  image_url text,
  image_alt_nl text,
  image_alt_en text,
  title_nl text not null,
  title_en text,
  summary_nl text not null,
  summary_en text,
  published boolean not null default true,
  created_by uuid references public.profiles (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index activities_date_idx on public.activities (date);
create index activities_created_by_idx on public.activities (created_by);

alter table public.activities enable row level security;

create policy "Anyone reads published activities; staff read all"
  on public.activities for select to anon, authenticated
  using (published or (select private.is_staff()));

create policy "Staff create activities"
  on public.activities for insert to authenticated
  with check ((select private.is_staff()));

create policy "Staff update activities"
  on public.activities for update to authenticated
  using ((select private.is_staff()))
  with check ((select private.is_staff()));

create policy "Staff delete activities"
  on public.activities for delete to authenticated
  using ((select private.is_staff()));

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger activities_set_updated_at
  before update on public.activities
  for each row execute function public.set_updated_at();

-- Public bucket for activity photos; only staff upload or remove.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('activity-images', 'activity-images', true, 10485760,
        array['image/jpeg', 'image/png', 'image/webp']);

create policy "Staff upload activity images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'activity-images' and (select private.is_staff()));

create policy "Staff update activity images"
  on storage.objects for update to authenticated
  using (bucket_id = 'activity-images' and (select private.is_staff()));

create policy "Staff delete activity images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'activity-images' and (select private.is_staff()));
