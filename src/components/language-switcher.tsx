"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";

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
    <div
      aria-label={label}
      className="flex rounded-full border border-border p-0.5 text-xs font-semibold uppercase"
    >
      {locales.map((value) => (
        <Link
          key={value}
          href={`/${value}${rest}`}
          hrefLang={value}
          aria-current={value === locale ? "true" : undefined}
          className={
            value === locale
              ? "rounded-full bg-foreground px-2 py-1 text-background"
              : "rounded-full px-2 py-1 text-muted-foreground hover:text-foreground"
          }
        >
          {value}
        </Link>
      ))}
    </div>
  );
}
