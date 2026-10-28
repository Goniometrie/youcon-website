import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { routes } from "@/lib/site";

/** Smalle pagina voor een formulier in het beheer, met een terug-link. */
export function AdminFormPage({
  title,
  back,
  locale,
  children,
}: {
  title: string;
  back: string;
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href={`/${locale}${routes.admin}`}
        className="text-sm font-bold text-brand hover:underline"
      >
        ← {back}
      </Link>
      <h1 className="mt-3 mb-8 text-3xl font-extrabold tracking-tight">{title}</h1>
      {children}
    </div>
  );
}
