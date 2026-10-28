-- Iedereen past op /account zijn eigen naam aan; rol en e-mail blijven dicht.
-- Toegepast op het Supabase-project "youcon-website" (eu-central-1).

create policy "Users update their own profile"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- RLS works per row, so the columns are limited with privileges: only the
-- name. Roles still change only via the dashboard or SQL.
revoke update on public.profiles from anon, authenticated;
grant update (full_name) on public.profiles to authenticated;
