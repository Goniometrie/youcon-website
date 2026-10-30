@AGENTS.md

# YouCon website

Nieuwe website voor YouCon, de studievereniging voor jonge constructeurs. Vervangt de oude WordPress-site op youcon.nu.

## Stack

- **Next.js 16** (App Router, `cacheComponents` aan), **React 19**, **TypeScript**
- **Tailwind CSS v4** — kleuren als tokens in `src/app/globals.css` (`teal-*`, `grey-*`, `brand`, `accent`, `muted`, …); gebruik die in plaats van losse hex-waarden
- **Huisstijl:** lees `docs/huisstijl.md` vóór je UI bouwt (logo, kleuren uit het logo, Open Sans, driehoek-vormtaal)
- **Repo:** Git + GitHub (`stichting-youcon/youcon-website`, openbaar; Goniometrie is collaborator); `main` = productie, werk via featurebranches en PR's
- **Hosting:** Vercel, gratis Hobby-account van YouCon (nog in te richten, zie `docs/vercel-keuze.md`): push naar `main` → productie, PR → preview-deploy
- **Backend:** Supabase (gekozen boven Firebase), project `youcon-website` in eu-central-1: auth, profielen met rollen, activiteiten, foto-opslag. Inschrijvingen en nieuwsbrief volgen. Postgres met Row Level Security
- Keuzes en onderbouwing: `docs/tech-stack.md`; accounts en overdracht: `docs/beheer.md`

## Commando's

- `npm run dev` — dev server op http://localhost:3000
- `npm run build` — productie-build (draai dit om wijzigingen te controleren)
- `npm run lint` — ESLint

## Structuur

- `src/app/[lang]/` — alle pagina's; `[lang]` is het root-segment (`nl` | `en`) en bevat de root layout
- `src/proxy.ts` — stuurt URL's zonder taalprefix door naar `/nl` of `/en` (Accept-Language); ververst de Supabase-sessie op `/admin` en `/inloggen` en stuurt niet-ingelogden van `/admin` naar inloggen
- `src/i18n/` — `config.ts` (locales), `dictionaries.ts` (`getDictionary()`, `getLocale()` via `next/root-params`), `dictionaries/{nl,en}.json`
- `src/components/` — gedeelde UI (header, footer, kaarten)
- `src/app/[lang]/admin/` — beheer voor bestuur/admin (activiteiten aanmaken, bewerken, verwijderen, aanmeldingen per activiteit); `inloggen/` is de loginpagina (e-mail/wachtwoord of Google; `?next=` stuurt na inloggen terug), `inloggen/callback/` ruilt de code uit Google of uit een bevestigings-/resetmail in voor een sessie, `inloggen/wachtwoord-vergeten/` en `inloggen/nieuw-wachtwoord/` zijn de wachtwoordreset. Instellen: `docs/google-login.md` en `docs/email-login.md` (SMTP, mailteksten)
- `src/app/[lang]/lid-worden/` — account aanmaken met Google of met e-mail/wachtwoord (`signUp` in `actions.ts`; Supabase mailt een bevestigingslink)
- `src/app/[lang]/activiteiten/actions.ts` — inschrijven en uitschrijven door ingelogde gebruikers; de database (trigger op `registrations`) controleert of er plek is
- `src/lib/` — data en helpers; `activities.ts` leest activiteiten uit Supabase (`use cache` + tag `activities`), `registrations.ts` geeft aantallen aanmeldingen (`use cache` + tag `registrations`) en je eigen inschrijvingen, `auth.ts` geeft het ingelogde profiel
- `src/lib/supabase/` — clients: `createSessionClient()` (als ingelogde gebruiker, leest cookies), `createPublicClient()` (anoniem, veilig in `use cache`), browser-client voor foto-uploads; `database.types.ts` is gegenereerd
- `supabase/migrations/` — databaseschema en RLS-policies

## Conventies

- Server Components standaard; `"use client"` alleen waar nodig (zoals de taalwisselaar).
- Alle zichtbare tekst gaat via de dictionaries. Voeg elke nieuwe sleutel toe aan **zowel** `nl.json` als `en.json`; het type `Dictionary` komt uit `nl.json`.
- URL-slugs zijn Nederlands en voor beide talen gelijk (`/en/activiteiten`). Routes staan in `src/lib/site.ts`.
- Links altijd met taalprefix: `` `/${locale}${routes.x}` ``.
- Nieuwe openbare pagina: zet `alternates: await alternates(routes.x)` in `generateMetadata` (canonical + hreflang) en voeg de route toe aan `publicRoutes` in `src/lib/seo.ts` (sitemap). Privépagina's krijgen `robots: { index: false }`. Absolute URL's gaan via `site.url`, nooit via de host van het verzoek.
- Nederlands is de standaardtaal.
- Elke Server Action die data wijzigt roept eerst `requireStaff()` aan en daarna `updateTag("activities")`. RLS in de database is de echte beveiliging; UI-checks zijn extra.
- Sessie lezen (cookies) alleen achter een `<Suspense>`-grens of in een Server Action (`cacheComponents`).
- Tracking en andere niet-noodzakelijke cookies alleen na toestemming: voeg een categorie toe in `src/lib/consent.ts` en laad de dienst in `src/components/cookie-consent.tsx` (zoals GA4 via `NEXT_PUBLIC_GA_MEASUREMENT_ID`). De keuze staat in de cookie `youcon_consent` en wordt alleen in de browser gelezen. Hoog `VERSION` op als er een dienst bijkomt, dan vraagt de banner opnieuw.

## Roadmap

1. Content van de oude site overzetten (missie, bestuur, geschiedenis, verenigingen)
2. ~~Supabase koppelen + inloggen voor bestuur, activiteiten beheren~~ (klaar)
3. ~~Inloggen voor leden en inschrijven voor activiteiten~~ (klaar; zelf een account aanmaken op `/lid-worden` met Google of e-mail/wachtwoord; voor e-mail is nog eigen SMTP nodig, zie `docs/email-login.md`; wachtlijst nog niet)
4. Nieuwsbrief-aanmelding
5. Deploy op Vercel en domein youcon.nu overzetten
