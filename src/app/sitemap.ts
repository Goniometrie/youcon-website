import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { absoluteUrl, languageAlternates, publicRoutes } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.flatMap((route) =>
    locales.map((locale) => ({
      url: absoluteUrl(locale, route),
      alternates: { languages: languageAlternates(route) },
    })),
  );
}
