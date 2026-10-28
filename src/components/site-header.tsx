import Link from "next/link";
import { Suspense } from "react";
import { signOut } from "@/app/[lang]/inloggen/actions";
import { FacetButton } from "@/components/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { NavLink } from "@/components/nav-link";
import { OrigamiLogo } from "@/components/origami-logo";
import type { Locale } from "@/i18n/config";
import { type Dictionary, getDictionary, getLocale } from "@/i18n/dictionaries";
import { getCurrentProfile, isStaff } from "@/lib/auth";
import { routes } from "@/lib/site";

export async function SiteHeader() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  const links = [
    { href: routes.activities, label: dict.nav.activities },
    { href: routes.association, label: dict.nav.association },
    { href: routes.partners, label: dict.nav.partners },
    { href: routes.contact, label: dict.nav.contact },
  ];

  return (
    <header>
      {/* Smalle teal balk, zoals de top bar van de oude site. */}
      <div className="bg-accent text-white">
        <div className="mx-auto flex h-9 max-w-site items-center justify-between gap-4 px-4 text-[13px] sm:px-6">
          <span className="truncate font-semibold">{dict.header.tagline}</span>
          {/* The session streams in; until then the bar shows the login link. */}
          <Suspense fallback={<LoginLink locale={locale} dict={dict} />}>
            <AccountLinks locale={locale} dict={dict} />
          </Suspense>
        </div>
      </div>

      <div className="border-b border-divider bg-white">
        <div className="mx-auto flex h-20 max-w-site items-center gap-3 px-4 sm:h-24 sm:gap-6 sm:px-6 lg:gap-10">
          <OrigamiLogo href={`/${locale}`} label={dict.header.home} />

          <nav className="hidden flex-1 items-center gap-7 text-[15px] font-semibold lg:flex">
            {links.map((link) => (
              <NavLink
                key={link.href}
                href={`/${locale}${link.href}`}
                className="text-body transition-colors hover:text-brand aria-[current=page]:text-brand"
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <LanguageSwitcher locale={locale} label={dict.nav.language} />
            <FacetButton href={`/${locale}${routes.join}`} className="hidden sm:inline-flex">
              {dict.nav.join}
            </FacetButton>

            <details className="relative lg:hidden">
              <summary className="flex min-h-11 cursor-pointer list-none items-center rounded-md border border-input px-3 text-sm font-semibold [&::-webkit-details-marker]:hidden">
                {dict.nav.menu}
              </summary>
              <nav className="absolute right-0 z-40 mt-2 flex w-56 flex-col rounded-lg border border-border bg-white p-2 shadow-lg">
                {[...links, { href: routes.join, label: dict.nav.join }].map((link) => (
                  <NavLink
                    key={link.href}
                    href={`/${locale}${link.href}`}
                    className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted aria-[current=page]:text-brand"
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
}

function LoginLink({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <Link href={`/${locale}${routes.login}`} className="shrink-0 font-bold hover:underline">
      {dict.nav.login}
    </Link>
  );
}

async function AccountLinks({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const profile = await getCurrentProfile();
  if (!profile) return <LoginLink locale={locale} dict={dict} />;

  return (
    <div className="flex shrink-0 items-center gap-4">
      {isStaff(profile) && (
        <Link href={`/${locale}${routes.admin}`} className="font-bold hover:underline">
          {dict.admin.title}
        </Link>
      )}
      <Link href={`/${locale}${routes.account}`} className="font-bold hover:underline">
        {dict.nav.account}
      </Link>
      <form action={signOut.bind(null, locale)}>
        <button type="submit" className="cursor-pointer font-bold hover:underline">
          {dict.admin.signOut}
        </button>
      </form>
    </div>
  );
}
