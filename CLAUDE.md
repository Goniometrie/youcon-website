@AGENTS.md

# YouCon website

Nieuwe website voor YouCon, de studievereniging voor jonge constructeurs. Vervangt de oude WordPress-site op youcon.nu.

## Stack

- **Next.js 16** (App Router, `cacheComponents` aan), **React 19**, **TypeScript**
- **Tailwind CSS v4** — kleuren als tokens in `src/app/globals.css` (`teal-*`, `grey-*`, `brand`, `accent`, `muted`, …); gebruik die in plaats van losse hex-waarden
- **Huisstijl:** lees `docs/huisstijl.md` vóór je UI bouwt (logo, kleuren uit het logo, Open Sans, driehoek-vormtaal)
- **Repo:** Git + GitHub (`Goniometrie/youcon-website`); `main` = productie, werk via featurebranches en PR's
- **Hosting:** Vercel (gepland): push naar `main` → productie, PR → preview-deploy
- **Backend:** Supabase (gekozen boven Firebase), project `youcon-website` in eu-central-1: auth, profielen met rollen, activiteiten, foto-opslag. Inschrijvingen en nieuwsbrief volgen. Postgres met Row Level Security
- Keuzes en onderbouwing: `docs/tech-stack.md`

## Commando's

- `npm run dev` — dev server op http://localhost:3000
- `npm run build` — productie-build (draai dit om wijzigingen te controleren)
- `npm run lint` — ESLint

## Structuur

- `src/app/[lang]/` — alle pagina's; `[lang]` is het root-segment (`nl` | `en`) en bevat de root layout
- `src/proxy.ts` — stuurt URL's zonder taalprefix door naar `/nl` of `/en` (Accept-Language); ververst de Supabase-sessie op `/admin` en `/inloggen` en stuurt niet-ingelogden van `/admin` naar inloggen
- `src/i18n/` — `config.ts` (locales), `dictionaries.ts` (`getDictionary()`, `getLocale()` via `next/root-params`), `dictionaries/{nl,en}.json`
- `src/components/` — gedeelde UI (header, footer, kaarten)
- `src/app/[lang]/admin/` — beheer voor bestuur/admin (activiteiten aanmaken, bewerken, verwijderen); `inloggen/` is de loginpagina
- `src/lib/` — data en helpers; `activities.ts` leest activiteiten uit Supabase (`use cache` + tag `activities`), `auth.ts` geeft het ingelogde profiel
- `src/lib/supabase/` — clients: `createSessionClient()` (als ingelogde gebruiker, leest cookies), `createPublicClient()` (anoniem, veilig in `use cache`), browser-client voor foto-uploads; `database.types.ts` is gegenereerd
- `supabase/migrations/` — databaseschema en RLS-policies

## Conventies

- Server Components standaard; `"use client"` alleen waar nodig (zoals de taalwisselaar).
- Alle zichtbare tekst gaat via de dictionaries. Voeg elke nieuwe sleutel toe aan **zowel** `nl.json` als `en.json`; het type `Dictionary` komt uit `nl.json`.
- URL-slugs zijn Nederlands en voor beide talen gelijk (`/en/activiteiten`). Routes staan in `src/lib/site.ts`.
- Links altijd met taalprefix: `` `/${locale}${routes.x}` ``.
- Nederlands is de standaardtaal.
- Elke Server Action die data wijzigt roept eerst `requireStaff()` aan en daarna `updateTag("activities")`. RLS in de database is de echte beveiliging; UI-checks zijn extra.
- Sessie lezen (cookies) alleen achter een `<Suspense>`-grens of in een Server Action (`cacheComponents`).

## Roadmap

1. Content van de oude site overzetten (missie, bestuur, geschiedenis, verenigingen)
2. ~~Supabase koppelen + inloggen voor bestuur, activiteiten beheren~~ (klaar)
3. Inloggen voor leden en inschrijven voor activiteiten
4. Nieuwsbrief-aanmelding
5. Deploy op Vercel en domein youcon.nu overzetten
