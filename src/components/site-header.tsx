import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { routes } from "@/lib/site";

export async function SiteHeader() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  const links = [
    { href: routes.association, label: dict.nav.association },
    { href: routes.activities, label: dict.nav.activities },
    { href: routes.partners, label: dict.nav.partners },
    { href: routes.contact, label: dict.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link
          href={`/${locale}`}
          className="text-xl font-bold tracking-tight text-brand"
        >
          YouCon
        </Link>

        <nav className="hidden flex-1 items-center gap-6 text-sm font-medium md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={`/${locale}${link.href}`}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 md:ml-0">
          <LanguageSwitcher locale={locale} label={dict.nav.language} />
          <Link
            href={`/${locale}${routes.login}`}
            className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:inline"
          >
            {dict.nav.login}
          </Link>
          <Link
            href={`/${locale}${routes.join}`}
            className="hidden rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground hover:opacity-90 sm:inline"
          >
            {dict.nav.join}
          </Link>

          <details className="relative md:hidden">
            <summary className="cursor-pointer list-none rounded-md border border-border px-3 py-1.5 text-sm font-medium">
              {dict.nav.menu}
            </summary>
            <nav className="absolute right-0 mt-2 flex w-56 flex-col rounded-lg border border-border bg-background p-2 shadow-lg">
              {[
                ...links,
                { href: routes.join, label: dict.nav.join },
                { href: routes.login, label: dict.nav.login },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={`/${locale}${link.href}`}
                  className="rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
