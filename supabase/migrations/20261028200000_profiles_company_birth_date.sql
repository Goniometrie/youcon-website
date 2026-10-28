-- Bedrijf (optioneel) en geboortedatum op het profiel. Met de geboortedatum
-- is bij te houden wie onder de leeftijdsgrens van 35 jaar valt. Het formulier
-- op /account maakt hem verplicht; hier mag hij leeg zijn, want bestaande
-- accounts hebben hem nog niet.
-- Toegepast op het Supabase-project "youcon-website" (eu-central-1).

alter table public.profiles
  add column company text check (char_length(company) <= 120),
  add column birth_date date check (birth_date >= date '1900-01-01');

-- Users may change these themselves, like their name.
grant update (company, birth_date) on public.profiles to authenticated;
