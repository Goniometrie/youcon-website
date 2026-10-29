-- Leden kunnen ook een account aanmaken met e-mail en wachtwoord (/lid-worden).
-- Dat formulier geeft naast de naam ook bedrijf en geboortedatum mee als
-- metadata; neem die over in het profiel. De metadata komt van de gebruiker,
-- dus een ongeldige geboortedatum wordt genegeerd in plaats van dat het
-- aanmaken mislukt. Het lid vult hem dan op /account in.

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
  works_at text := left(nullif(trim(meta ->> 'company'), ''), 120);
  born date;
begin
  if given is null and whole <> '' then
    given := split_part(whole, ' ', 1);
    family := nullif(trim(substr(whole, length(given) + 1)), '');
  end if;

  begin
    born := nullif(meta ->> 'birth_date', '')::date;
  exception when others then
    born := null;
  end;
  if born < date '1900-01-01' or born > current_date then
    born := null;
  end if;

  insert into public.profiles (id, email, first_name, last_name, company, birth_date)
  values (new.id, new.email, given, family, works_at, born);
  return new;
end;
$$;
