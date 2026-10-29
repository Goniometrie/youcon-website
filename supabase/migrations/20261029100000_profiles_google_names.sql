-- Leden kunnen zelf een account aanmaken met Google. Google geeft de naam als
-- given_name/family_name of alleen als volledige naam; die laatste splitsen we
-- zoals bij de eerdere migratie: eerste woord voornaam, de rest achternaam.
-- Toegepast op het Supabase-project "youcon-website" (eu-central-1).

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  given text := nullif(trim(coalesce(meta ->> 'first_name', meta ->> 'given_name')), '');
  family text := nullif(trim(coalesce(meta ->> 'last_name', meta ->> 'family_name')), '');
  whole text := trim(coalesce(meta ->> 'full_name', meta ->> 'name', ''));
begin
  if given is null and whole <> '' then
    given := split_part(whole, ' ', 1);
    family := nullif(trim(substr(whole, length(given) + 1)), '');
  end if;

  insert into public.profiles (id, email, first_name, last_name)
  values (new.id, new.email, given, family);
  return new;
end;
$$;
