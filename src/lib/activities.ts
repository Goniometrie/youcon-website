import { cacheLife, cacheTag } from "next/cache";
import type { Locale } from "@/i18n/config";
import type { Tables } from "@/lib/supabase/database.types";
import { createPublicClient } from "@/lib/supabase/server";

export type ActivityType = Tables<"activities">["type"];

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
  /** A path in `public/` or a Supabase Storage URL. */
  image?: { src: string; alt: Record<Locale, string> };
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
};

/** Cache tag for every public read; Server Actions update it after a change. */
export const ACTIVITIES_TAG = "activities";

/** Map a database row to an Activity; empty English fields fall back to Dutch. */
export function toActivity(row: Tables<"activities">): Activity {
  return {
    slug: row.slug,
    type: row.type,
    date: row.date,
    time: row.time?.slice(0, 5),
    location: row.location,
    partner: row.partner ?? undefined,
    englishSpoken: row.english_spoken,
    registrationUrl: row.registration_url ?? undefined,
    image: row.image_url
      ? {
          src: row.image_url,
          alt: { nl: row.image_alt_nl ?? "", en: row.image_alt_en || row.image_alt_nl || "" },
        }
      : undefined,
    title: { nl: row.title_nl, en: row.title_en || row.title_nl },
    summary: { nl: row.summary_nl, en: row.summary_en || row.summary_nl },
  };
}

/** Published activities in date order (oldest first). */
async function getPublished(): Promise<Activity[]> {
  "use cache";
  cacheTag(ACTIVITIES_TAG);
  cacheLife("hours");

  const { data, error } = await createPublicClient()
    .from("activities")
    .select("*")
    .eq("published", true)
    .order("date")
    .order("time", { nullsFirst: true });
  if (error) throw error;
  return data.map(toActivity);
}

/** Today in Amsterdam as YYYY-MM-DD. */
export const today = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Amsterdam" }).format(new Date());

/** All published activities, newest first. */
export async function getActivities(): Promise<Activity[]> {
  return (await getPublished()).toReversed();
}

/** The next activity to feature, plus the ones after it, in date order. */
export async function getAgenda(limit = 3) {
  "use cache";
  cacheTag(ACTIVITIES_TAG);
  // Refreshes at least daily, so an activity drops off the agenda once it's over.
  cacheLife("hours");

  const now = today();
  const upcoming = (await getPublished()).filter((activity) => activity.date >= now);
  return { featured: upcoming.at(0), upcoming: upcoming.slice(1, limit + 1) };
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
