# YouCon huisstijl

Geanalyseerd van de huidige youcon.nu (oktober 2026). Kleuren zijn gemeten uit het logobestand zelf.

## Logo

| Bestand                         | Gebruik                                             |
| ------------------------------- | --------------------------------------------------- |
| `public/brand/youcon-logo.png`  | Woordmerk "YouCon", 3281×827, transparant. Bron van de logo-driehoeken. |
| `public/brand/yc-icon.jpg`      | Beeldmerk "YC", 512×512, witte achtergrond. Footer. |
| `src/app/icon.jpg`, `apple-icon.jpg` | Favicon / home-screen icoon (kopie van YC).    |

Het logo is opgebouwd uit **gevouwen driehoeken** (origami/constructie): elke letter bestaat uit steile parallellogrammen die langs de diagonaal in twee tinten zijn gevouwen. "Y" en "C" zijn teal, "o u o n" grijs.

In de header staat het logo als inline SVG (`OrigamiLogo`, `src/components/origami-logo.tsx`): de 67 driehoeken uit `src/lib/logo-facets.ts`, exact uit het logobestand gehaald, met per driehoek een vouwrand (`bottom`/`left`/`right`) en vertraging. Bij het laden vouwt het logo zich letter voor letter op (keyframes `foldB`/`foldL`/`foldR` in `globals.css`, ~2,2 s); bij hover vouwt het opnieuw, maar niet zolang de animatie nog loopt.

Gebruik het logo altijd op een lichte achtergrond: de grijze letters verdwijnen op donker. Op donkere vlakken (footer) gebruik je het YC-icoon met witte achtergrond.

## Kleuren

Teal (uit "Y" en "C"), Tailwind: `teal-100` … `teal-800`

| Token      | Hex       | Gebruik                                  |
| ---------- | --------- | ---------------------------------------- |
| `teal-100` | `#87cfce` | Lichtste facet, accenten op donker       |
| `teal-200` | `#76bbc0` | Facet                                    |
| `teal-300` | `#66a6af` | Facet                                    |
| `teal-400` | `#56929d` | Facet                                    |
| `teal-500` | `#447d8e` | Labels, hover van knoppen                |
| `teal-600` | `#34687d` | Primaire knoppen (`brand`), links        |
| `teal-700` | `#244b5a` | Koppen, footer (afgeleid, donkerder)     |
| `teal-800` | `#17323d` | Hoofdtekst (`foreground`) (afgeleid)     |

Grijs (uit "o u o n"), Tailwind: `grey-100` … `grey-500`: `#cccccc`, `#b4b4b4`, `#a0a0a0`, `#8c8c8c`, `#787878`. Daarnaast `grey-50` (`#e0e0e0`, afgeleid) voor inactieve driehoekjes in de taalwisselaar.

Overig van de oude site: top bar `#64a4b1` (`accent`), achtergrond `#efefef` (`muted`). De footer is `teal-700`.

Neutrale tinten voor tekst en lijnen:

| Token              | Hex       | Gebruik                                        |
| ------------------ | --------- | ---------------------------------------------- |
| `body`             | `#4a5b62` | Lopende tekst, nav-links                       |
| `muted-foreground` | `#5a6a70` | Meta-tekst, labels                             |
| `divider`          | `#e3e8ea` | Scheidingslijnen (header, agenda, details)     |
| `input`            | `#c5d2d6` | Randen van invoervelden, ghost-knoppen, datums |
| `border`           | `#dde3e5` | Kaartranden, achtergrond van foto's die laden  |

Inhoudsbreedte: `max-w-site` (1200px) voor header, secties en footer.

Witte tekst op `teal-600` haalt WCAG AA. Gebruik `teal-300` en lichter niet voor tekst op wit.

## Typografie

**Open Sans** (zoals op de oude site), via `next/font`. Koppen `font-extrabold` met `tracking-tight`, labels in hoofdletters met `tracking-wider`.

## Vormtaal

Driehoeks-utilities (in `globals.css`):

- `clip-slant` — parallellogram, beide zijkanten schuin over `--slant` (standaard 12px, `[--slant:13px]` voor de CTA).
- `clip-tri-up`, `clip-tri-down` — gelijkbenige driehoek met de punt boven/onder.
- `clip-tri-tl`, `clip-tri-tr`, `clip-tri-bl`, `clip-tri-br` — halve tegel langs de diagonaal, in de genoemde hoek.

Componenten:

- `OrigamiLogo` — zichzelf opvouwend logo in de header (zie Logo).
- `LanguageSwitcher` — NL/EN als twee in elkaar geschoven parallellogrammen met gevouwen driehoekjes. Actief: `teal-600` met witte tekst; inactief: `muted`. Bij hover verkleuren de driehoekjes één voor één. Echte links naar `/nl/…` en `/en/…` met `aria-current`.
- `FacetButton` (`src/components/button.tsx`) — parallellogramknop voor de hoofd-CTA "Word lid", met links en rechts twee driehoeken die bij hover en `focus-visible` gestaffeld van kleur wisselen.
- `buttonClass(variant)` — gewone knoppen van 48px hoog: `primary` (teal-600 vlak), `outline` (teal-600 rand), `ghost` (lichte rand, voor secundaire acties zoals "Zet in agenda").
- `FeaturedActivity` / `AgendaRow` (`src/components/agenda.tsx`) — de uitgelichte activiteit met foto en datumblok, en de agendaregels met datumtegel en schuivend pijltje.
- `PhotoMosaic` — 4×2 staande tegels, elk diagonaal gedeeld in een foto en een gekleurd facet; kolom 2 en 4 zakken 30%. Het facet vervaagt langzaam en komt in een andere kleur terug in de tegenovergestelde hoek (en weer terug), zodat de hele foto een keer te zien is. Cyclus van 30s per tegel, fades van ~2,4s, tegels om de ~4s verspreid (`facet-swap-out`/`-in` in `globals.css`).
- `BoardGroupPhoto` / `BoardMemberRow` (`src/components/board.tsx`) — bestuurspagina: groepsfoto half over de paginakop, met schuin label en gevouwen hoek; daaronder per bestuurslid een staand portret (4:5) en tekst, om en om van kant, met een gevouwen hoek die naar de tekst wijst. Zonder foto een rustig facettenvlak. Namen en foto's staan in `src/lib/board.ts`, functies (`board.roles`) en teksten per persoon (`board.bios`) in de dictionaries.
- `NewsletterBand` — nieuwsbriefband op `muted`; het formulier staat uit tot er een backend is.

- `Facets` (`src/components/facets.tsx`) — decoratief driehoekspatroon in logostijl, met `.fade-left` naar links uitvloeiend.
- `.edge-slant` — schuine onderrand van hero's en paginakoppen, net als de diagonale vouwen.
- `SectionTitle` — kop met klein gevouwen driehoekje.
- Kaarten met een gevouwen hoekje rechtsboven.
- Hoeken licht afgerond (`rounded-md`/`rounded-lg`), geen pillen: het logo is hoekig.

## Beweging

Animaties zijn kort en functioneel: het logo vouwt op, driehoekjes verkleuren gestaffeld (0–0,21 s vertraging, 0,3 s duur), pijltjes schuiven 4px. De facetten in het fotomozaïek wisselen heel rustig en nooit allemaal tegelijk. Bij `prefers-reduced-motion: reduce` staan alle animaties en overgangen uit en staat het logo direct volledig in beeld (regel onderaan `globals.css`).

Let op bij nieuwe keyframes: Tailwind v4 / Lightning CSS maakt van een `animation`-shorthand zonder naam `animation: none`. Gebruik losse eigenschappen (`animation-name`, `-duration`, `-timing-function`, `-fill-mode`).
