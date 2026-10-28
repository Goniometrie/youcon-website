import type { StaticImageData } from "next/image";
import type { Locale } from "@/i18n/config";
import betonevent from "../../public/images/betonevent.jpg";
import cpoLeeuwenhoek from "../../public/images/cpo-leeuwenhoek.jpg";
import gietijzerPerron from "../../public/images/gietijzer-perron.jpg";

export type ActivityType = "excursion" | "theme-evening" | "event";

export type Activity = {
  slug: string;
  type: ActivityType;
  /** YYYY-MM-DD */
  date: string;
  /** HH:MM, Europe/Amsterdam; omitted when unknown. */
  time?: string;
  location: string;
  /** Short name of the partner organising it with us. */
  partner?: string;
  englishSpoken?: boolean;
  /** External sign-up link until registration lives in this site. */
  registrationUrl?: string;
  image?: { src: StaticImageData; alt: Record<Locale, string> };
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
};

// Static seed data taken from the current youcon.nu. This moves to Supabase
// once activities can be created and joined through the site.
const activities: Activity[] = [
  {
    slug: "thema-avond-gietijzer",
    type: "theme-evening",
    date: "2027-01-27",
    time: "17:30",
    location: "Movares, Utrecht",
    partner: "Movares",
    image: {
      src: gietijzerPerron,
      alt: {
        nl: "Gietijzeren spanten van een overkapping boven een stationsperron",
        en: "Cast iron trusses of a canopy over a railway platform",
      },
    },
    title: { nl: "Thema-avond gietijzer", en: "Theme evening: cast iron" },
    summary: {
      nl: "Wim van 't Land van Movares vertelt over gietijzer als constructiemateriaal. Van stationskappen tot bruggen: ontdek hoe je met dit historische materiaal rekent. Schrijf je in, stel je vragen en praat na op de borrel!",
      en: "Wim van 't Land of Movares talks about cast iron as a structural material. From station canopies to bridges: find out how to work with this historic material. Sign up, bring your questions and stay for drinks afterwards!",
    },
  },
  {
    slug: "excursie-zuidasdok",
    type: "excursion",
    date: "2026-02-11",
    time: "15:00",
    location: "Station Amsterdam Zuid",
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
    image: {
      src: betonevent,
      alt: { nl: "Lichtletters met de tekst Betonevent", en: "Marquee letters spelling Betonevent" },
    },
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
    time: "15:00",
    location: "Delft",
    partner: "VHC",
    englishSpoken: true,
    image: {
      src: cpoLeeuwenhoek,
      alt: {
        nl: "Render van het houten appartementencomplex CPO LeeuwenHoek in Delft",
        en: "Render of the timber apartment complex CPO LeeuwenHoek in Delft",
      },
    },
    title: { nl: "Excursie CPO LeeuwenHoek, Delft", en: "Site visit CPO LeeuwenHoek, Delft" },
    summary: {
      nl: "Een rondleiding bij een houten appartementencomplex naast Delft Centraal, met een presentatie over de constructieve uitdagingen. Vincent Raadschelder van de Vereniging van Houtconstructeurs leidt ons rond. Afsluiting met een borrel.",
      en: "A tour of a timber apartment complex next to Delft Central Station, with a presentation on its structural challenges. Vincent Raadschelder of the Dutch timber engineers association shows us around. We close with drinks.",
    },
  },
];

/** All activities, newest first. */
export async function getActivities(): Promise<Activity[]> {
  return [...activities].sort((a, b) => b.date.localeCompare(a.date));
}

/** The next activity to feature, plus the ones after it, in date order. */
export async function getAgenda(limit = 3) {
  // TODO: filter on `date >= today` once real data comes from Supabase. Until
  // then the newest seed activity is featured and the older ones stand in for
  // what comes after it, as in the design.
  const sorted = [...activities].sort((a, b) => a.date.localeCompare(b.date));
  const featured = sorted.pop()!;
  return { featured, upcoming: sorted.slice(0, limit) };
}

/** Format an activity's date in Dutch or English, in Amsterdam time. */
export function formatActivityDate(
  activity: Activity,
  locale: Locale,
  options: Intl.DateTimeFormatOptions,
) {
  return new Intl.DateTimeFormat(locale === "nl" ? "nl-NL" : "en-GB", {
    timeZone: "Europe/Amsterdam",
    ...options,
  })
    .format(new Date(`${activity.date}T12:00:00Z`))
    .replace(".", "");
}

/**
 * An iCalendar file for "add to calendar", as a data URL. Activities without a
 * time become all-day events; timed ones get a default length of three hours.
 */
export function calendarUrl(activity: Activity, locale: Locale) {
  const day = activity.date.replaceAll("-", "");
  let when: string[];
  if (activity.time) {
    const [h, m] = activity.time.split(":").map(Number);
    const at = (hour: number) =>
      `${day}T${String(hour).padStart(2, "0")}${String(m).padStart(2, "0")}00`;
    when = [`DTSTART;TZID=Europe/Amsterdam:${at(h)}`, `DTEND;TZID=Europe/Amsterdam:${at(h + 3)}`];
  } else {
    when = [`DTSTART;VALUE=DATE:${day}`];
  }
  const escape = (text: string) => text.replace(/[\\;,]/g, (c) => `\\${c}`);
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//YouCon//Website//NL",
    "BEGIN:VEVENT",
    `UID:${activity.slug}@youcon.nu`,
    `DTSTAMP:${day}T000000Z`,
    ...when,
    `SUMMARY:${escape(activity.title[locale])}`,
    `LOCATION:${escape(activity.location)}`,
    `DESCRIPTION:${escape(activity.summary[locale])}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}
