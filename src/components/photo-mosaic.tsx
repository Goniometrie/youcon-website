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

/**
 * 4×2 staande tegels, elk diagonaal gedeeld in een foto en een gekleurd
 * facet. De tweede en vierde kolom zakken iets, zoals de vouwen in het logo.
 */
const TILES: {
  photo: StaticImageData;
  photoCorner: Corner;
  facet: string;
  facetCorner: Corner;
  position?: string;
  offset?: string;
}[] = [
  { photo: bamboePaviljoen, photoCorner: "tr", facet: "bg-teal-100", facetCorner: "bl" },
  { photo: postTower, photoCorner: "tl", facet: "bg-teal-600", facetCorner: "br", offset: "mt-[30%]" },
  { photo: cpoLeeuwenhoek, photoCorner: "tl", facet: "bg-grey-100", facetCorner: "br" },
  { photo: betonevent, photoCorner: "bl", facet: "bg-teal-200", facetCorner: "tr", offset: "mt-[30%]" },
  { photo: betonTrap, photoCorner: "br", facet: "bg-grey-200", facetCorner: "tl", offset: "-mt-[30%]" },
  { photo: cpoLeeuwenhoek, photoCorner: "tr", facet: "bg-teal-500", facetCorner: "bl", position: "80% 50%" },
  { photo: bamboePaviljoen, photoCorner: "br", facet: "bg-teal-300", facetCorner: "tl", offset: "-mt-[30%]", position: "20% 50%" },
  { photo: postTower, photoCorner: "tl", facet: "bg-grey-400", facetCorner: "br", position: "90% 50%" },
];

export function PhotoMosaic({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`grid grid-cols-4 ${className}`}>
      {TILES.map((tile, i) => (
        <div key={i} className={`relative aspect-[3/5] overflow-hidden ${tile.offset ?? ""}`}>
          <span className={`absolute inset-0 ${tile.facet} ${CLIP[tile.facetCorner]}`} />
          <Image
            src={tile.photo}
            alt=""
            fill
            sizes="(min-width: 1024px) 150px, 25vw"
            className={`object-cover ${CLIP[tile.photoCorner]}`}
            style={tile.position ? { objectPosition: tile.position } : undefined}
          />
        </div>
      ))}
    </div>
  );
}
