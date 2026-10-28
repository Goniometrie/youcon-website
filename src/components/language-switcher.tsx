"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";

/**
 * NL/EN als twee parallellogrammen met gevouwen driehoekjes aan de randen.
 * Bij hover verkleuren de driehoekjes één voor één.
 */
export function LanguageSwitcher({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const pathname = usePathname();
  const rest = pathname.replace(/^\/[^/]+/, "");

  return (
    <div role="group" aria-label={label} className="flex items-stretch">
      {locales.map((value) => {
        const active = value === locale;
        return (
          <Link
            key={value}
            href={`/${value}${rest}`}
            hrefLang={value}
            lang={value}
            aria-current={active ? "true" : undefined}
            className={`group clip-slant relative flex min-h-11 min-w-[58px] items-center justify-center px-5 text-[13px] leading-none font-bold tracking-[0.06em] uppercase transition-colors duration-250 not-first:-ml-[9px] focus-visible:shadow-[inset_0_0_0_3px_var(--color-teal-100)] focus-visible:outline-none ${
              active
                ? "cursor-default bg-teal-600 text-white"
                : "bg-muted text-teal-600 hover:text-teal-800"
            }`}
          >
            <span
              aria-hidden="true"
              className={`clip-tri-up absolute inset-y-0 left-0 w-6 transition-colors duration-300 ${
                active ? "bg-teal-500" : "bg-grey-50 group-hover:bg-teal-100"
              }`}
            />
            <span className="relative">{value}</span>
            <span
              aria-hidden="true"
              className={`clip-tri-down absolute inset-y-0 right-0 w-6 transition-colors delay-75 duration-300 ${
                active ? "bg-teal-100" : "bg-grey-100 group-hover:bg-teal-400"
              }`}
            />
          </Link>
        );
      })}
    </div>
  );
}
