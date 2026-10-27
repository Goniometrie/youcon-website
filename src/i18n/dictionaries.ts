import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "./config";
import type nl from "./dictionaries/nl.json";

export type Dictionary = typeof nl;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  nl: () => import("./dictionaries/nl.json").then((module) => module.default),
  en: () => import("./dictionaries/en.json").then((module) => module.default),
};

/** Current locale from the `[lang]` root segment; 404s on unknown locales. */
export async function getLocale(): Promise<Locale> {
  const locale = await lang();
  if (!hasLocale(locale)) notFound();
  return locale;
}

export async function getDictionary(): Promise<Dictionary> {
  return dictionaries[await getLocale()]();
}
