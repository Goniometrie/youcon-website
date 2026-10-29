import type { Dictionary } from "@/i18n/dictionaries";

type PartnersDictionary = Dictionary["partners"];

export type PartnerCategory = keyof PartnersDictionary["categories"];

export type Partner = {
  /** Sleutel in `partners.descriptions` van de dictionaries: de korte omschrijving. */
  id: keyof PartnersDictionary["descriptions"];
  category: PartnerCategory;
  name: string;
  /** Voluit, als de naam een afkorting is. */
  fullName?: string;
  url: string;
};

/** Categorieën in de volgorde waarin ze op de pagina staan. */
export const partnerCategories: PartnerCategory[] = [
  "safety",
  "concrete",
  "steel",
  "timber",
  "international",
];

/** Studie- en vakverenigingen, van de oude site overgenomen (links gecheckt in oktober 2026). */
export const partners: Partner[] = [
  {
    id: "vnconstructeurs",
    category: "safety",
    name: "VNconstructeurs",
    url: "https://www.vnconstructeurs.nl/",
  },
  {
    id: "kpcv",
    category: "safety",
    name: "Kennisportaal Constructieve Veiligheid",
    url: "https://kpcv.nl/",
  },
  {
    id: "betonvereniging",
    category: "concrete",
    name: "Betonvereniging",
    url: "https://www.betonvereniging.nl/",
  },
  {
    id: "stufib",
    category: "concrete",
    name: "Stufib",
    url: "https://stufib.nl/",
  },
  {
    id: "stubeco",
    category: "concrete",
    name: "Stubeco",
    url: "https://www.stubeco.nl/",
  },
  {
    id: "stutech",
    category: "concrete",
    name: "Stutech",
    url: "https://www.stutech.nl/",
  },
  {
    id: "bouwenMetStaal",
    category: "steel",
    name: "Bouwen met Staal",
    url: "https://www.bouwenmetstaal.nl/",
  },
  {
    id: "houtconstructeurs",
    category: "timber",
    name: "Vereniging van Houtconstructeurs",
    url: "https://verenigingvanhoutconstructeurs.nl/",
  },
  {
    id: "iabse",
    category: "international",
    name: "IABSE",
    fullName: "International Association for Bridge and Structural Engineering",
    url: "https://iabse.org/",
  },
];

/** Domeinnaam zonder `www.`, als leesbare linktekst. */
export function partnerDomain(url: string): string {
  return new URL(url).hostname.replace(/^www\./, "");
}
