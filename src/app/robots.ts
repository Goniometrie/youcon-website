import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { routes, site } from "@/lib/site";

// Inloggen (met de wachtwoordpagina's), account en admin horen niet in
// zoekresultaten; die pagina's staan daarnaast zelf op noindex.
const PRIVATE_ROUTES = [routes.admin, routes.account, routes.login];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: locales.flatMap((locale) =>
        PRIVATE_ROUTES.map((route) => `/${locale}${route}`),
      ),
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
