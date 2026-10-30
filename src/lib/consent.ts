/**
 * Cookietoestemming (Telecommunicatiewet art. 11.7a, AVG): de keuze staat in
 * de cookie `youcon_consent` en wordt alleen in de browser gelezen, zodat de
 * pagina's statisch blijven. Alleen voor client components.
 */

/** Optionele categorieën; later bijvoorbeeld `marketing` en `embeds`. */
export const consentCategories = ["analytics"] as const;
export type ConsentCategory = (typeof consentCategories)[number];
export type ConsentChoices = Record<ConsentCategory, boolean>;

export type Consent = {
  /** Ophogen als de categorieën of diensten veranderen: dan vragen we opnieuw. */
  version: number;
  /** Datum van de keuze (JJJJ-MM-DD). */
  date: string;
  choices: ConsentChoices;
};

const COOKIE = "youcon_consent";
const VERSION = 1;
const MAX_AGE = 60 * 60 * 24 * 365; // 12 maanden

/** GA4-measurement-id; zonder id laden we geen analytics en vragen we niets. */
export const gaMeasurementId = /^G-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "")
  ? process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!
  : null;

/** Categorieën waarvoor nu echt een dienst draait. */
export const activeCategories: ConsentCategory[] = gaMeasurementId ? ["analytics"] : [];

export const noChoices: ConsentChoices = { analytics: false };
export const allChoices: ConsentChoices = { analytics: true };

/** Ruwe cookiewaarde: stabiel als snapshot voor `useSyncExternalStore`. */
function readRaw(): string {
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE}=([^;]*)`));
  return match ? match[1] : "";
}

/** Geldige keuze uit de cookiewaarde, of `null` (geen of verouderde keuze). */
export function parseConsent(raw: string): Consent | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(decodeURIComponent(raw));
    if (value?.version !== VERSION || typeof value.date !== "string") return null;
    return {
      version: VERSION,
      date: value.date,
      choices: Object.fromEntries(
        consentCategories.map((c) => [c, value.choices?.[c] === true]),
      ) as ConsentChoices,
    };
  } catch {
    return null;
  }
}

const listeners = new Set<() => void>();

export function subscribeConsent(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Op de server en tijdens hydratie weten we de keuze nog niet. */
export const getConsentSnapshot = readRaw;
export const getServerConsentSnapshot = (): string | null => null;

export function saveConsent(choices: ConsentChoices) {
  const consent: Consent = {
    version: VERSION,
    date: new Date().toISOString().slice(0, 10),
    choices,
  };
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE}=${encodeURIComponent(JSON.stringify(consent))}; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax${secure}`;
  listeners.forEach((listener) => listener());
}

/** Verwijdert cookies op dit domein en op elk bovenliggend domein. */
export function deleteCookies(match: (name: string) => boolean) {
  const names = document.cookie
    .split("; ")
    .map((pair) => pair.split("=")[0])
    .filter((name) => name && match(name));
  const parts = location.hostname.split(".");
  const domains = [""];
  for (let i = 0; i < parts.length - 1; i++) domains.push(`; Domain=.${parts.slice(i).join(".")}`);
  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; Path=/; Max-Age=0${domain}`;
    }
  }
}

const OPEN_EVENT = "youcon:cookie-settings";

/** Opent de cookie-instellingen, bijvoorbeeld vanuit de footer. */
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onOpenCookieSettings(handler: () => void) {
  window.addEventListener(OPEN_EVENT, handler);
  return () => window.removeEventListener(OPEN_EVENT, handler);
}
