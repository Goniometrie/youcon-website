# YouCon website

De nieuwe website van **YouCon**, de studievereniging voor jonge constructeurs. Deze site vervangt de huidige WordPress-site op [youcon.nu](https://youcon.nu).

Gebouwd met Next.js 16, React 19, TypeScript en Tailwind CSS v4. Tweetalig (NL/EN). Hosting op Vercel, database en inloggen via Supabase. Zie [docs/tech-stack.md](docs/tech-stack.md) voor de keuzes en de onderbouwing.

## Aan de slag

```bash
npm install
cp .env.example .env.local   # vul de Supabase-URL en publishable key in
npm run dev
```

Open daarna [http://localhost:3000](http://localhost:3000). Je wordt automatisch doorgestuurd naar `/nl` of `/en`.

## Scripts

| Commando        | Wat het doet               |
| --------------- | -------------------------- |
| `npm run dev`   | Dev server                 |
| `npm run build` | Productie-build            |
| `npm run start` | Productie-build draaien    |
| `npm run lint`  | Code controleren (ESLint)  |

## Roadmap

- [x] Basis: tweetalige structuur, layout, pagina's
- [ ] Content overzetten van de oude site
- [x] Inloggen voor het bestuur en activiteiten beheren (Supabase)
- [ ] Inloggen voor leden
- [ ] Inschrijven voor activiteiten
- [ ] Nieuwsbrief
- [ ] Livegang op Vercel + domein

Zie [CLAUDE.md](CLAUDE.md) voor de projectstructuur en conventies.
