import type { Metadata } from "next";
import { defaultLocale, locales, type Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/dictionaries";
import { routes, site } from "@/lib/site";

type Route = (typeof routes)[keyof typeof routes];

/** Pagina's voor zoekmachines; inloggen, account en admin bewust niet. */
export const publicRoutes: Route[] = [
  routes.home,
  routes.association,
  routes.mission,
  routes.history,
  routes.board,
  routes.activities,
  routes.join,
  routes.partners,
  routes.contact,
  routes.privacy,
];

/** `og:locale` per taal. */
export const ogLocales: Record<Locale, string> = { nl: "nl_NL", en: "en_GB" };

/** Volledige URL van een route in een taal, bijvoorbeeld `https://youcon.nu/en/missie`. */
export const absoluteUrl = (locale: Locale, route: Route) =>
  `${site.url}/${locale}${route}`;

/** De route in elke taal, plus `x-default` naar de standaardtaal (hreflang). */
export function languageAlternates(route: Route) {
  return {
    ...Object.fromEntries(locales.map((locale) => [locale, absoluteUrl(locale, route)])),
    "x-default": absoluteUrl(defaultLocale, route),
  };
}

/** Canonical en hreflang voor de huidige taal: `alternates: await alternates(routes.x)`. */
export async function alternates(route: Route): Promise<Metadata["alternates"]> {
  return {
    canonical: absoluteUrl(await getLocale(), route),
    languages: languageAlternates(route),
  };
}
