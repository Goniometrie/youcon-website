import Image, { type StaticImageData } from "next/image";
import bamboePaviljoen from "../../public/images/bamboe-paviljoen.jpg";
import betonTrap from "../../public/images/beton-trap.jpg";
import betonevent from "../../public/images/betonevent.jpg";
import cpoLeeuwenhoek from "../../public/images/cpo-leeuwenhoek.jpg";
import postTower from "../../public/images/post-tower.jpg";

type Corner = "tl" | "tr" | "bl" | "br";

const CLIP: Record<Corner, string> = {
  tl: "clip-tri-tl",
  tr: "clip-tri-tr",
  bl: "clip-tri-bl",
  br: "clip-tri-br",
};

const OPPOSITE: Record<Corner, Corner> = { tl: "br", tr: "bl", bl: "tr", br: "tl" };

/** Lengte van één wisselcyclus per tegel, in seconden (zie `facet-swap-*` in globals.css). */
const CYCLE = 30;

/**
 * 4×2 staande tegels, elk diagonaal gedeeld in een foto en een gekleurd
 * facet. De tweede en vierde kolom zakken iets, zoals de vouwen in het logo.
 * Het facet vervaagt langzaam en komt terug als `swap`-facet in de andere
 * hoek, zodat de hele foto een keer te zien is. `order` spreidt de tegels
 * over de cyclus, zodat ze niet tegelijk wisselen.
 */
const TILES: {
  photo: StaticImageData;
  position?: string;
  facet: string;
  corner: Corner;
  swap: string;
  order: number;
  offset?: string;
}[] = [
  { photo: bamboePaviljoen, facet: "bg-teal-100", corner: "bl", swap: "bg-grey-400", order: 0 },
  { photo: postTower, facet: "bg-teal-600", corner: "br", swap: "bg-grey-200", order: 4, offset: "mt-[30%]" },
  { photo: cpoLeeuwenhoek, facet: "bg-grey-100", corner: "br", swap: "bg-teal-300", order: 2 },
  { photo: betonevent, facet: "bg-teal-200", corner: "tr", swap: "bg-grey-500", order: 6, offset: "mt-[30%]" },
  { photo: betonTrap, facet: "bg-grey-200", corner: "tl", swap: "bg-teal-500", order: 5, offset: "-mt-[30%]" },
  { photo: cpoLeeuwenhoek, position: "80% 50%", facet: "bg-teal-500", corner: "bl", swap: "bg-grey-100", order: 1 },
  { photo: bamboePaviljoen, position: "20% 50%", facet: "bg-teal-300", corner: "tl", swap: "bg-grey-300", order: 7, offset: "-mt-[30%]" },
  { photo: postTower, position: "90% 50%", facet: "bg-grey-400", corner: "br", swap: "bg-teal-200", order: 3 },
];

export function PhotoMosaic({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`grid grid-cols-4 ${className}`}>
      {TILES.map((tile, i) => {
        // Negatieve vertraging: elke tegel start in de rustfase (eerste ~10s van
        // de cyclus), dus het beginbeeld is het design en de eerste wissel komt
        // na ~2s; daarna volgen de andere om de ~4s.
        const delay = { animationDelay: `${(tile.order * CYCLE) / TILES.length - 8}s` };
        return (
          <div key={i} className={`relative aspect-[3/5] overflow-hidden ${tile.offset ?? ""}`}>
            <Image
              src={tile.photo}
              alt=""
              fill
              sizes="(min-width: 1024px) 150px, 25vw"
              className="object-cover"
              style={tile.position ? { objectPosition: tile.position } : undefined}
            />
            <span
              className={`facet-swap-out absolute inset-0 ${tile.facet} ${CLIP[tile.corner]}`}
              style={delay}
            />
            <span
              className={`facet-swap-in absolute inset-0 ${tile.swap} ${CLIP[OPPOSITE[tile.corner]]}`}
              style={delay}
            />
          </div>
        );
      })}
    </div>
  );
}
