-- Elke activiteit krijgt een voertaal (Nederlands of Engels), zodat bezoekers
-- altijd zien in welke taal ze plaatsvindt. Vervangt de vlag english_spoken.
-- Toegepast op het Supabase-project "youcon-website" (eu-central-1).

create type public.activity_language as enum ('nl', 'en');

alter table public.activities
  add column language public.activity_language not null default 'nl';

update public.activities set language = 'en' where english_spoken;

alter table public.activities drop column english_spoken;
