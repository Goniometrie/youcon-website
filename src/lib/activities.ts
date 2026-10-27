import type { Locale } from "@/i18n/config";

export type ActivityType = "excursion" | "theme-evening" | "event";

export type Activity = {
  slug: string;
  type: ActivityType;
  /** YYYY-MM-DD */
  date: string;
  /** HH:MM, Europe/Amsterdam; omitted when unknown. */
  time?: string;
  location: string;
  englishSpoken?: boolean;
  /** External sign-up link until registration lives in this site. */
  registrationUrl?: string;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
};

// Static seed data taken from the current youcon.nu. This moves to Supabase
// once activities can be created and joined through the site.
const activities: Activity[] = [
  {
    slug: "excursie-zuidasdok",
    type: "excursion",
    date: "2026-02-11",
    time: "15:00",
    location: "Amsterdam Zuid",
    title: { nl: "Excursie Zuidasdok", en: "Site visit Zuidasdok" },
    summary: {
      nl: "Geerte Kotteman van TBI Mobilis neemt ons mee over de bouwplaats van station Amsterdam Zuid, met daarna een borrel.",
      en: "Geerte Kotteman of TBI Mobilis shows us around the construction site at Amsterdam Zuid station, followed by drinks.",
    },
  },
  {
    slug: "betonevent-2025",
    type: "event",
    date: "2025-11-20",
    location: "1931 Congrescentrum, Den Bosch",
    registrationUrl: "https://www.betonevent.nl/",
    title: { nl: "YouCon op het Betonevent 2025", en: "YouCon at Betonevent 2025" },
    summary: {
      nl: "Een fishbowl-sessie voor jonge en toekomstige constructeurs over verantwoordelijkheid, doorleren, duurzaamheid en digitalisering.",
      en: "A fishbowl session for young and future structural engineers on responsibility, learning, sustainability and digitalisation.",
    },
  },
  {
    slug: "excursie-cpo-leeuwenhoek",
    type: "excursion",
    date: "2025-10-30",
    location: "CPO LeeuwenHoek, Delft",
    englishSpoken: true,
    title: { nl: "Excursie CPO LeeuwenHoek Delft", en: "Site visit CPO LeeuwenHoek Delft" },
    summary: {
      nl: "Rondleiding bij een houten appartementencomplex bij Delft Centraal, met Vincent Raadschelder van de Vereniging van Houtconstructeurs.",
      en: "A tour of a timber apartment complex near Delft Central Station, guided by Vincent Raadschelder of the Dutch timber engineers association.",
    },
  },
];

/** All activities, newest first. */
export async function getActivities(): Promise<Activity[]> {
  return [...activities].sort((a, b) => b.date.localeCompare(a.date));
}
