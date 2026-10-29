export type Founder = {
  name: string;
  /** Werkgever ten tijde van de oprichting in 2009. */
  organisation: string;
  initiator?: boolean;
};

/** De tien oprichters van YouCon (19 november 2009), in de volgorde van de oude site. */
export const founders: Founder[] = [
  { name: "Ad Heeman", organisation: "RGD" },
  { name: "Edwin Thie", organisation: "Arup" },
  { name: "Marjorie Greveling", organisation: "Strukton" },
  { name: "Helen Kok", organisation: "Gemeente Eindhoven" },
  { name: "Linda Bukman", organisation: "TNO" },
  { name: "Luuk Janssen", organisation: "Tielemans" },
  { name: "Raphaël Steenbergen", organisation: "TNO", initiator: true },
  { name: "Ruben Laurijsen", organisation: "ABT" },
  { name: "Twan Hendriks", organisation: "Corsmit" },
  { name: "Wendy Poppelaars", organisation: "DHV" },
];
