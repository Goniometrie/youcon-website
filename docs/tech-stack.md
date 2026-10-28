# Tech stack

Vastgestelde keuzes voor de YouCon-website, met de reden erachter.

| Onderdeel          | Keuze                                        |
| ------------------ | -------------------------------------------- |
| Runtime & taal     | Node.js + TypeScript                         |
| Framework          | Next.js 16 (App Router), React 19            |
| Styling            | Tailwind CSS v4                              |
| Code & versiebeheer | Git, repository op GitHub (`Goniometrie/youcon-website`) |
| Hosting & deploy   | Vercel                                       |
| Database & auth    | Supabase (Postgres, Auth, Row Level Security) |

## Node.js & TypeScript

Alles is TypeScript: pagina's, componenten en straks de datalaag. Database-types genereren we uit Supabase (`supabase gen types typescript`), zodat queries end-to-end getypeerd zijn.

Next.js 16 vereist minimaal Node.js 20.9. Vercel draait op de actuele LTS-versie.

## GitHub & Git

- `main` is de productiebranch: wat op `main` staat, staat live.
- Werk gebeurt op featurebranches en komt via een pull request op `main`.
- Geen secrets in de repo: `.env*` staat in `.gitignore`. Sleutels staan in Vercel (en lokaal in `.env.local`).

## Vercel

Vercel is gekoppeld aan de GitHub-repo:

- Elke push naar `main` → productiedeploy op youcon.nu.
- Elke pull request → eigen preview-URL om wijzigingen te bekijken vóór de merge.
- Omgevingsvariabelen (Supabase-URL en -sleutels) staan in de Vercel-projectinstellingen, gescheiden per omgeving (Production / Preview / Development).

## Supabase (gekozen boven Firebase)

Supabase levert de database (Postgres), het inloggen (Auth) en de beveiliging per rij (Row Level Security).

**Waarom Supabase en niet Firebase:**

- **Relationele data.** Leden, activiteiten, inschrijvingen en nieuwsbriefaanmeldingen hangen aan elkaar. Vragen als "hoeveel plekken zijn er nog?" of "op welke activiteiten heeft dit lid zich ingeschreven?" zijn in SQL één query. In Firestore (NoSQL) moet je data dupliceren en zelf consistent houden.
- **Beveiliging in de database.** Met Row Level Security leggen we in de database vast dat een lid alleen de eigen gegevens en inschrijvingen ziet en dat alleen het bestuur activiteiten aanmaakt. Dat geldt ook als er in de frontend iets misgaat.
- **Privacy (AVG).** We slaan persoonsgegevens van leden op. Een Supabase-project draait in een EU-regio (Frankfurt), en de data staat in standaard Postgres die we altijd kunnen exporteren of verhuizen.
- **Past bij Next.js en Vercel.** `@supabase/ssr` werkt met Server Components en cookies, en er is een Vercel-integratie die de omgevingsvariabelen automatisch zet.
- **Kosten.** Het gratis plan is ruim genoeg voor een studievereniging. Let op: gratis projecten pauzeren na een week zonder activiteit. Bij livegang overwegen we het betaalde plan.

Firebase zou ook werken, maar ons datamodel is relationeel en Firebase wordt dan het lastigere van de twee.

### Project

- Supabase-project `youcon-website` (ref `ufnafujtromrhiruvrjo`), regio eu-central-1 (Frankfurt).
- Migraties staan in `supabase/migrations/`; de types in `src/lib/supabase/database.types.ts` (opnieuw genereren na een migratie).

### Datamodel

- `profiles` — één rij per account, automatisch aangemaakt bij een nieuwe gebruiker; `role` is `member`, `board` of `admin`
- `activities` — soort, datum, tijd, locatie, partner, titel en omschrijving (NL verplicht, EN optioneel), foto, externe inschrijflink, `published` (concept of zichtbaar)
- Storage-bucket `activity-images` — foto's die het bestuur via het beheer uploadt (publiek leesbaar)
- Nog te bouwen: `registrations` (inschrijvingen) en `newsletter_subscribers`

### Rechten (Row Level Security)

| Wie                  | Activiteiten                               | Foto's           |
| -------------------- | ------------------------------------------ | ---------------- |
| Bezoeker / lid       | gepubliceerde lezen                        | lezen            |
| Bestuur (`board`) en `admin` | alles lezen, aanmaken, wijzigen, verwijderen | uploaden en verwijderen |

Een rol wijzig je alleen via het Supabase-dashboard of SQL, nooit vanuit de site.

### Een bestuurslid toegang geven

1. Supabase-dashboard → **Authentication → Users → Add user → Create new user**: e-mailadres en een wachtwoord, met **Auto Confirm User** aan.
2. In de SQL-editor: `update public.profiles set role = 'board' where email = 'naam@voorbeeld.nl';`
3. Het bestuurslid logt in op `/nl/inloggen` en komt in het beheer op `/nl/admin`.

### Omgevingsvariabelen

Zie `.env.example`. Lokaal in `.env.local`; op Vercel in de projectinstellingen.

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```
