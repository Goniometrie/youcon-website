import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { defaultLocale, hasLocale, locales } from "@/i18n/config";
import en from "@/i18n/dictionaries/en.json";
import nl from "@/i18n/dictionaries/nl.json";
import { LOGO_VIEWBOX, logoFacets } from "@/lib/logo-facets";
import { site } from "@/lib/site";

// Deelafbeelding voor LinkedIn, WhatsApp en co., per taal. `next/root-params`
// werkt niet in deze route handler, dus de taal komt uit `params`. `notFound()`
// mag hier ook niet; een onbekende taal krijgt de Nederlandse afbeelding.

const dictionaries = { nl, en };
const dictFor = (lang: string) => dictionaries[hasLocale(lang) ? lang : defaultLocale];

const size = { width: 1200, height: 630 };
const contentType = "image/png";

const fonts = await Promise.all(
  (["SemiBold", "ExtraBold"] as const).map((name) =>
    readFile(join(process.cwd(), `assets/fonts/OpenSans-${name}.ttf`)),
  ),
);

const TEALS = ["#87cfce", "#76bbc0", "#66a6af", "#56929d", "#447d8e", "#34687d"];
const GREYS = ["#cccccc", "#b4b4b4", "#a0a0a0", "#8c8c8c"];

/** Gevouwen parallellogrammen zoals `Facets`, uitwaaierend naar links. */
function facetTriangles(cols: number, rows: number, w: number, h: number) {
  const triangles: { points: string; fill: string }[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if ((x * 3 + y * 5) % 7 < Math.max(1, 5 - x)) continue;
      const [x0, y0, x1, y1] = [x * w, y * h, (x + 1) * w, (y + 1) * h];
      const halves =
        (x + y) % 2 === 0
          ? [`${x0},${y0} ${x1},${y0} ${x1},${y1}`, `${x0},${y0} ${x1},${y1} ${x0},${y1}`]
          : [`${x0},${y0} ${x1},${y0} ${x0},${y1}`, `${x1},${y0} ${x1},${y1} ${x0},${y1}`];
      halves.forEach((points, i) => {
        const seed = x * 7 + y * 13 + i * 5;
        const palette = seed % 4 === 0 ? GREYS : TEALS;
        triangles.push({ points, fill: palette[seed % palette.length] });
      });
    }
  }
  return triangles;
}

const FACET_COLS = 6;
const FACET_W = 66;
const FACET_H = 105;
const facets = facetTriangles(FACET_COLS, 6, FACET_W, FACET_H);

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ lang: string }> | { lang: string };
}) {
  const { lang } = await params;
  return [{ id: "youcon", alt: dictFor(lang).meta.title, size, contentType }];
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const dict = dictFor((await params).lang);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#ffffff",
          fontFamily: "Open Sans",
          position: "relative",
        }}
      >
        {/* Facetten rechts, uitwaaierend naar de tekst. */}
        <svg
          width={FACET_COLS * FACET_W}
          height={size.height}
          viewBox={`0 0 ${FACET_COLS * FACET_W} ${size.height}`}
          style={{ position: "absolute", right: 0, top: 0 }}
        >
          {facets.map((t) => (
            <polygon key={t.points} points={t.points} fill={t.fill} />
          ))}
        </svg>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 0 0 88px",
            width: 800,
          }}
        >
          <svg width={600} height={(600 * 82.7) / 328.1} viewBox={LOGO_VIEWBOX}>
            {logoFacets.map((f) => (
              <polygon key={f.points} points={f.points} fill={f.fill} />
            ))}
          </svg>
          <div
            style={{
              marginTop: 40,
              fontSize: 50,
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
              color: "#244b5a",
            }}
          >
            {dict.header.tagline}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 36,
              fontSize: 28,
              fontWeight: 600,
              color: "#34687d",
            }}
          >
            {/* Klein gevouwen driehoekje, zoals bij de sectiekoppen. */}
            <svg width={22} height={22} viewBox="0 0 22 22" style={{ marginRight: 14 }}>
              <polygon points="0,0 22,0 0,22" fill="#34687d" />
              <polygon points="22,0 22,22 0,22" fill="#87cfce" />
            </svg>
            {new URL(site.url).host}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Open Sans", data: fonts[0], weight: 600, style: "normal" },
        { name: "Open Sans", data: fonts[1], weight: 800, style: "normal" },
      ],
    },
  );
}
