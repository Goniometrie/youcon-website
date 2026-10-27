import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/logo";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { routes, site } from "@/lib/site";

export async function SiteHeader() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  const links = [
    { href: routes.association, label: dict.nav.association },
    { href: routes.activities, label: dict.nav.activities },
    { href: routes.partners, label: dict.nav.partners },
    { href: routes.contact, label: dict.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40">
      {/* Smalle teal balk, zoals de top bar van de oude site. */}
      <div className="bg-accent text-white">
        <div className="mx-auto flex h-9 max-w-6xl items-center justify-between gap-4 px-4 text-xs sm:px-6">
          <span className="truncate font-medium">{dict.footer.tagline}</span>
          <div className="flex shrink-0 items-center gap-4">
            <a href={`mailto:${site.email}`} className="hidden hover:underline sm:inline">
              {site.email}
            </a>
            <Link href={`/${locale}${routes.login}`} className="font-semibold hover:underline">
              {dict.nav.login}
            </Link>
          </div>
        </div>
      </div>

      <div className="border-b border-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-18 max-w-6xl items-center gap-8 px-4 sm:px-6">
          <Link href={`/${locale}`} className="shrink-0">
            <Logo className="h-8 w-auto sm:h-9" />
          </Link>

          <nav className="hidden flex-1 items-center gap-7 text-sm font-semibold md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                className="text-muted-foreground transition-colors hover:text-brand"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3 md:ml-0">
            <LanguageSwitcher locale={locale} label={dict.nav.language} />
            <Link
              href={`/${locale}${routes.join}`}
              className="hidden rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-hover sm:inline"
            >
              {dict.nav.join}
            </Link>

            <details className="relative md:hidden">
              <summary className="cursor-pointer list-none rounded-md border border-border px-3 py-1.5 text-sm font-semibold">
                {dict.nav.menu}
              </summary>
              <nav className="absolute right-0 mt-2 flex w-56 flex-col rounded-lg border border-border bg-white p-2 shadow-lg">
                {[...links, { href: routes.join, label: dict.nav.join }].map((link) => (
                  <Link
                    key={link.href}
                    href={`/${locale}${link.href}`}
                    className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
}
