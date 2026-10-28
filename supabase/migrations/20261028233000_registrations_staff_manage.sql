-- Het bestuur beheert de personenlijst: iemand met een account toevoegen of
-- uitschrijven. De trigger blijft gelden, dus ook het bestuur kan niet over
-- het maximum heen en niemand toevoegen aan een activiteit die geweest is.
-- Toegepast op het Supabase-project "youcon-website" (eu-central-1).

drop policy "Users register themselves" on public.registrations;
create policy "Users register themselves; staff register anyone"
  on public.registrations for insert to authenticated
  with check (profile_id = (select auth.uid()) or (select private.is_staff()));

drop policy "Users cancel their own registration before the day" on public.registrations;
create policy "Users cancel their own registration before the day; staff remove anyone"
  on public.registrations for delete to authenticated
  using (
    (select private.is_staff())
    or (
      profile_id = (select auth.uid())
      and exists (
        select 1 from public.activities a
        where a.id = activity_id and a.date >= (now() at time zone 'Europe/Amsterdam')::date
      )
    )
  );
