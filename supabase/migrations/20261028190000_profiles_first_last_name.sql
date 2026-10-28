-- Naam opgesplitst in voornaam en achternaam (met tussenvoegsel). full_name
-- blijft bestaan als afgeleide kolom, zodat bestaande code hem kan lezen.
-- Toegepast op het Supabase-project "youcon-website" (eu-central-1).

alter table public.profiles
  add column first_name text,
  add column last_name text;

-- Existing names: first word is the first name, the rest the last name.
update public.profiles
set
  first_name = split_part(full_name, ' ', 1),
  last_name = nullif(trim(substr(full_name, length(split_part(full_name, ' ', 1)) + 1)), '')
where full_name is not null;

alter table public.profiles drop column full_name;
alter table public.profiles
  add column full_name text generated always as (
    nullif(trim(coalesce(first_name, '') || ' ' || coalesce(last_name, '')), '')
  ) stored;

-- New users: take the names from the sign-up metadata.
create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, first_name, last_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'full_name'),
    new.raw_user_meta_data ->> 'last_name'
  );
  return new;
end;
$$;

-- Users may change their own first and last name, nothing else.
grant update (first_name, last_name) on public.profiles to authenticated;
