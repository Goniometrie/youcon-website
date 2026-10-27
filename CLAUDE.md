@AGENTS.md

# YouCon website

Nieuwe website voor YouCon, de studievereniging voor jonge constructeurs. Vervangt de oude WordPress-site op youcon.nu.

## Stack

- **Next.js 16** (App Router, `cacheComponents` aan), **React 19**, **TypeScript**
- **Tailwind CSS v4** — kleuren als tokens in `src/app/globals.css` (`brand`, `accent`, `muted`, …); gebruik die in plaats van losse hex-waarden
- **Hosting:** Vercel (gepland)
- **Backend:** Supabase (gepland) voor auth, leden, activiteiten, inschrijvingen en nieuwsbrief

## Commando's

- `npm run dev` — dev server op http://localhost:3000
- `npm run build` — productie-build (draai dit om wijzigingen te controleren)
- `npm run lint` — ESLint

## Structuur

- `src/app/[lang]/` — alle pagina's; `[lang]` is het root-segment (`nl` | `en`) en bevat de root layout
- `src/proxy.ts` — stuurt URL's zonder taalprefix door naar `/nl` of `/en` (Accept-Language)
- `src/i18n/` — `config.ts` (locales), `dictionaries.ts` (`getDictionary()`, `getLocale()` via `next/root-params`), `dictionaries/{nl,en}.json`
- `src/components/` — gedeelde UI (header, footer, kaarten)
- `src/lib/` — data en helpers; `activities.ts` is tijdelijke seed-data tot Supabase er is

## Conventies

- Server Components standaard; `"use client"` alleen waar nodig (zoals de taalwisselaar).
- Alle zichtbare tekst gaat via de dictionaries. Voeg elke nieuwe sleutel toe aan **zowel** `nl.json` als `en.json`; het type `Dictionary` komt uit `nl.json`.
- URL-slugs zijn Nederlands en voor beide talen gelijk (`/en/activiteiten`). Routes staan in `src/lib/site.ts`.
- Links altijd met taalprefix: `` `/${locale}${routes.x}` ``.
- Nederlands is de standaardtaal.

## Roadmap

1. Content van de oude site overzetten (missie, bestuur, geschiedenis, verenigingen)
2. Supabase koppelen + inloggen (leden en bestuur, rollen)
3. Activiteiten aanmaken (bestuur, admin-pagina) en inschrijven (leden)
4. Nieuwsbrief-aanmelding
5. Deploy op Vercel en domein youcon.nu overzetten
