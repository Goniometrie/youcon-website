export const locales = ["nl", "en"] as const;
export const defaultLocale = "nl";

export type Locale = (typeof locales)[number];

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);
