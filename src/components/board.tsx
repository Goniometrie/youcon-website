import Image, { type StaticImageData } from "next/image";
import { Facets } from "@/components/facets";
import type { Dictionary } from "@/i18n/dictionaries";
import type { BoardMember } from "@/lib/board";

type Corner = "tl" | "tr" | "bl" | "br";

const ROTATE: Record<Corner, string> = {
  tr: "",
  br: "rotate-90",
  bl: "rotate-180",
  tl: "-rotate-90",
};

const POSITION: Record<Corner, string> = {
  tr: "top-0 right-0",
  br: "bottom-0 right-0",
  bl: "bottom-0 left-0",
  tl: "top-0 left-0",
};

/** Kleuren van de gevouwen hoek per bestuurslid, zoals de facetten van het logo. */
const FOLDS = [
  { light: "#87cfce", dark: "#34687d" },
  { light: "#cccccc", dark: "#56929d" },
  { light: "#76bbc0", dark: "#244b5a" },
  { light: "#b4b4b4", dark: "#447d8e" },
  { light: "#66a6af", dark: "#17323d" },
];

/** Gevouwen hoek over een foto: grote lichte driehoek met een donkere vouw. */
function Fold({
  corner,
  light,
  dark,
  className,
}: {
  corner: Corner;
  light: string;
  dark: string;
  /** Grootte, bijvoorbeeld `w-1/4`. */
  className: string;
}) {
  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden="true"
      className={`absolute aspect-square ${POSITION[corner]} ${ROTATE[corner]} ${className}`}
    >
      <polygon points="0,0 40,0 40,40" fill={light} />
      <polygon points="20,0 40,0 40,20" fill={dark} />
    </svg>
  );
}

/** Vlak met facetten zolang er nog geen foto is. */
function PhotoPlaceholder({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-muted">
      <Facets
        cols={6}
        rows={4}
        greys
        className="absolute inset-0 h-full w-full opacity-15"
      />
      <span className="relative rounded-md bg-white/85 px-4 py-2 text-sm font-bold text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

/** Groepsfoto van het bestuur, half over de paginakop heen. */
export function BoardGroupPhoto({
  photo,
  dict,
}: {
  photo?: StaticImageData;
  dict: Dictionary["board"];
}) {
  return (
    <figure className="relative mx-auto -mt-24 max-w-site px-4 sm:-mt-32 sm:px-6">
      <div className="relative aspect-[3/2] overflow-hidden rounded-[10px] bg-border shadow-[0_1px_2px_rgba(23,50,61,0.06),0_12px_32px_rgba(23,50,61,0.08)] sm:aspect-[21/9]">
        {photo ? (
          <Image
            src={photo}
            alt={dict.groupPhotoAlt}
            fill
            preload
            sizes="(min-width: 1200px) 1152px, 100vw"
            className="object-cover object-top"
          />
        ) : (
          <PhotoPlaceholder label={dict.groupPhotoSoon} />
        )}
        {/* Op mobiel onderaan, zodat het label geen gezichten bedekt. */}
        <span className="absolute bottom-4 left-0 bg-white py-2 pr-6 pl-4 text-[11px] font-extrabold sm:top-6 sm:bottom-auto sm:py-2.5 sm:pr-7 sm:pl-5 sm:text-[13px] tracking-[0.14em] text-brand uppercase [clip-path:polygon(0_0,100%_0,calc(100%_-_14px)_100%,0_100%)]">
          {dict.term}
        </span>
        <Fold corner="br" light="#87cfce" dark="#34687d" className="w-16 sm:w-28" />
      </div>
    </figure>
  );
}

/**
 * Eén bestuurslid: staande foto en tekst naast elkaar. De foto wisselt per
 * lid van kant, de gevouwen hoek wijst steeds naar de tekst.
 */
export function BoardMemberRow({
  member,
  index,
  dict,
}: {
  member: BoardMember;
  index: number;
  dict: Dictionary["board"];
}) {
  const role = dict.roles[member.role];
  const bio = dict.bios[member.id];
  const flipped = index % 2 === 1;
  const fold = FOLDS[index % FOLDS.length];

  return (
    <li className="grid items-center gap-8 py-12 first:pt-0 last:pb-0 md:grid-cols-12 md:gap-12 md:py-16">
      <div
        className={`relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-lg bg-border md:col-span-4 md:row-start-1 md:max-w-none ${
          flipped ? "md:col-start-9" : "md:col-start-1"
        }`}
      >
        {member.photo ? (
          <Image
            src={member.photo}
            alt={member.name}
            fill
            sizes="(min-width: 1200px) 370px, (min-width: 768px) 33vw, 384px"
            className="object-cover"
          />
        ) : (
          <PhotoPlaceholder label={dict.photoSoon} />
        )}
        {/* Dunne rand, zodat ook een foto met witte achtergrond een tegel blijft. */}
        <span className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-teal-800/10 ring-inset" />
        <Fold
          corner={flipped ? "bl" : "br"}
          light={fold.light}
          dark={fold.dark}
          className="w-1/4"
        />
      </div>

      <div className={`md:col-span-7 md:row-start-1 ${flipped ? "md:col-start-1" : "md:col-start-6"}`}>
        <span aria-hidden="true" className="text-5xl leading-none font-extrabold text-teal-100">
          {String(index + 1).padStart(2, "0")}
        </span>
        <p className="mt-4 text-[13px] font-bold tracking-[0.2em] text-teal-500 uppercase">
          {role}
        </p>
        <h2 className="mt-2 text-[clamp(28px,3vw,40px)] leading-[1.1] font-extrabold tracking-[-0.02em] text-teal-700">
          {member.name}
        </h2>
        <p className="mt-4 max-w-[520px] text-lg leading-[1.65] text-body">{bio}</p>
        {member.linkedin && (
          <a
            href={member.linkedin}
            aria-label={`LinkedIn: ${member.name}`}
            className="mt-5 inline-block font-bold text-brand hover:text-brand-hover"
          >
            LinkedIn →
          </a>
        )}
      </div>
    </li>
  );
}
