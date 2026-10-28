import type { StaticImageData } from "next/image";
import type { Dictionary } from "@/i18n/dictionaries";
import coenRijna from "../../public/images/bestuur/coen-rijna.jpg";
import femkeMiddeldorp from "../../public/images/bestuur/femke-middeldorp.png";
import florineVerschuure from "../../public/images/bestuur/florine-verschuure.jpg";
import groepsfoto from "../../public/images/bestuur/groepsfoto.webp";
import janPeterPilon from "../../public/images/bestuur/jan-peter-pilon.jpg";
import liseJansen from "../../public/images/bestuur/lise-jansen.jpg";
import paulBrink from "../../public/images/bestuur/paul-brink.jpg";
import tomDiks from "../../public/images/bestuur/tom-diks.jpg";

type BoardDictionary = Dictionary["board"];

export type BoardMember = {
  /** Sleutel in `board.bios` van de dictionaries: de korte tekst over deze persoon. */
  id: keyof BoardDictionary["bios"];
  /** Sleutel in `board.roles`: de functie in het bestuur. */
  role: keyof BoardDictionary["roles"];
  name: string;
  /** Portretfoto; de pagina snijdt bij tot 4:5. */
  photo?: StaticImageData;
  linkedin?: string;
};

/**
 * Groepsfoto bovenaan de pagina, liggend. De pagina snijdt bij tot 21:9 (3:2
 * op mobiel) en houdt de bovenkant in beeld, zodat de hoofden blijven staan.
 */
// TODO: tijdelijke foto, vervangen door een groepsfoto van het huidige bestuur.
export const groupPhoto: StaticImageData | undefined = groepsfoto;

/** Bestuursleden in de volgorde waarin ze op de pagina staan. */
export const boardMembers: BoardMember[] = [
  {
    id: "tom",
    role: "chair",
    name: "Tom Diks",
    photo: tomDiks,
    linkedin: "https://www.linkedin.com/in/tom-diks/",
  },
  {
    id: "lise",
    role: "secretary",
    name: "Lise Jansen",
    photo: liseJansen,
    linkedin: "https://www.linkedin.com/in/lise-jansen-905241143/",
  },
  {
    id: "femke",
    role: "treasurer",
    name: "Femke Middeldorp",
    photo: femkeMiddeldorp,
    linkedin: "https://www.linkedin.com/in/femke-middeldorp-960b9a181/",
  },
  {
    id: "florine",
    role: "member",
    name: "Florine Verschuure",
    photo: florineVerschuure,
    linkedin: "https://www.linkedin.com/in/florine-verschuure-b9840a186/",
  },
  {
    id: "janPeter",
    role: "member",
    name: "Jan-Peter Pilon",
    photo: janPeterPilon,
    linkedin: "https://www.linkedin.com/in/jan-peter-pilon-380626112/",
  },
  {
    id: "coen",
    role: "member",
    name: "Coen Rijna",
    photo: coenRijna,
    linkedin: "https://www.linkedin.com/in/coen-rijna-92132512b/",
  },
  {
    id: "paul",
    role: "member",
    name: "Paul Brink",
    photo: paulBrink,
    linkedin: "https://www.linkedin.com/in/paul-brink/",
  },
];
