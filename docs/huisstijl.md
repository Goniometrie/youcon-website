# YouCon huisstijl

Geanalyseerd van de huidige youcon.nu (oktober 2026). Kleuren zijn gemeten uit het logobestand zelf.

## Logo

| Bestand                         | Gebruik                                             |
| ------------------------------- | --------------------------------------------------- |
| `public/brand/youcon-logo.png`  | Woordmerk "YouCon", 3281×827, transparant. Header.  |
| `public/brand/yc-icon.jpg`      | Beeldmerk "YC", 512×512, witte achtergrond. Footer. |
| `src/app/icon.jpg`, `apple-icon.jpg` | Favicon / home-screen icoon (kopie van YC).    |

Het logo is opgebouwd uit **gevouwen driehoeken** (origami/constructie): elke letter bestaat uit steile parallellogrammen die langs de diagonaal in twee tinten zijn gevouwen. "Y" en "C" zijn teal, "o u o n" grijs.

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

Grijs (uit "o u o n"), Tailwind: `grey-100` … `grey-500`: `#cccccc`, `#b4b4b4`, `#a0a0a0`, `#8c8c8c`, `#787878`.

Overig van de oude site: top bar/footer `#64a4b1` (`accent`), achtergrond `#efefef` (`muted`).

Witte tekst op `teal-600` haalt WCAG AA. Gebruik `teal-300` en lichter niet voor tekst op wit.

## Typografie

**Open Sans** (zoals op de oude site), via `next/font`. Koppen `font-extrabold` met `tracking-tight`, labels in hoofdletters met `tracking-wider`.

## Vormtaal

- `Facets` (`src/components/facets.tsx`) — decoratief driehoekspatroon in logostijl, met `.fade-left` naar links uitvloeiend.
- `.edge-slant` — schuine onderrand van hero's en paginakoppen, net als de diagonale vouwen.
- `SectionTitle` — kop met klein gevouwen driehoekje.
- Kaarten met een gevouwen hoekje rechtsboven.
- Hoeken licht afgerond (`rounded-md`/`rounded-lg`), geen pillen: het logo is hoekig.
