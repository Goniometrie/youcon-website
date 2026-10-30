import type { NextConfig } from "next";
import { routes } from "./site";

type Redirect = Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>>[number];

/**
 * Old youcon.nu URLs (WordPress) → new pages. The old site was Dutch, so
 * everything goes to `/nl`. Sources: Wayback Machine and the old site's
 * WordPress API (October 2026); the full table is in the PR for issue #24.
 *
 * These run before the proxy, so an old URL reaches the new page in one step.
 * Next.js passes the query string on (`/nl/bestuur?page_id=452`); the
 * canonical tag on each page covers that for search engines.
 * Anything at `/?…` that isn't listed here (authors, `?paged=`) ends up on
 * the homepage through the proxy.
 */

const nl = (route: string) => `/nl${route}`;

/** WordPress IDs (2021–2026), linked as `/?page_id=N` and `/?p=N`. */
const ids: Record<number, string> = {
  117: routes.contact,
  121: routes.login,
  123: routes.join, // Word Lid
  177: routes.association,
  179: routes.mission,
  183: routes.history,
  186: routes.privacy,
  452: routes.board,
  651: routes.partners, // Studie- en vakverenigingen
  80: routes.forgotPassword,
  78: routes.account,
  87: routes.account, // Profiel
  92: routes.account, // Leden
  1314: routes.account, // Leden
  237: routes.activities, // Activiteiten (Events Manager)
  292: routes.activities, // Evenementen
  1008: routes.activities, // Archief activiteiten
  1202: routes.board, // post: Nieuw bestuurslid Kees van Essen
};

/** Query parameters of WordPress and its event plugins that list activities. */
const activityQueries = [
  "p", // posts: almost all announce or report on an activity
  "event",
  "event-categories",
  "tribe_events",
  "location",
  "cat",
  "tag",
];

/** Paths of the site before 2021 (pretty URLs). */
const paths: [source: string, route: string][] = [
  ["/vereniging/missie", routes.mission],
  ["/vereniging/geschiedenis", routes.history],
  ["/vereniging/bestuur/:slug*", routes.board],
  ["/vereniging/contact", routes.contact],
  ["/vereniging/privacy-", routes.privacy],
  ["/vereniging/links", routes.partners],
  ["/vereniging/:slug+", routes.association],
  ["/word-lid/:slug*", routes.join],
  ["/service/:slug*", routes.partners], // partner associations, committees
  ["/activiteiten/:slug+", routes.activities],
  ["/agenda/:slug*", routes.activities],
  ["/youcongres/:slug*", routes.activities],
  ["/YouCongres.htm", routes.activities],
  ["/in-de-media/:slug*", routes.home], // press articles
  ["/index.htm", routes.home],
  ["/welkom.htm", routes.home],
];

export const legacyRedirects: Redirect[] = [
  // Specific IDs first: `?p=N` is also WordPress's shortlink to a page.
  ...Object.entries(ids).flatMap(([id, route]) =>
    ["page_id", "p"].map((key) => ({
      source: "/",
      has: [{ type: "query" as const, key, value: id }],
      destination: nl(route),
      permanent: true,
    })),
  ),
  ...activityQueries.map((key) => ({
    source: "/",
    has: [{ type: "query" as const, key }],
    destination: nl(routes.activities),
    permanent: true,
  })),
  ...paths.map(([source, route]) => ({
    source,
    destination: nl(route),
    permanent: true,
  })),
];
