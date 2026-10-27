# YouCon website

De nieuwe website van **YouCon**, de studievereniging voor jonge constructeurs. Deze site vervangt de huidige WordPress-site op [youcon.nu](https://youcon.nu).

Gebouwd met Next.js 16, React 19, TypeScript en Tailwind CSS v4. Tweetalig (NL/EN).

## Aan de slag

```bash
npm install
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
- [ ] Inloggen (Supabase Auth)
- [ ] Activiteiten aanmaken en inschrijven
- [ ] Nieuwsbrief
- [ ] Livegang op Vercel + domein

Zie [CLAUDE.md](CLAUDE.md) voor de projectstructuur en conventies.
