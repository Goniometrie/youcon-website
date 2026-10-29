import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { GoogleSignIn } from "@/components/google-sign-in";
import { PageHeader, Section } from "@/components/page-header";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { routes, site } from "@/lib/site";
import { LoginForm } from "./login-form";
import { safeNext } from "./next";

const LOGIN_ERRORS = ["google", "confirm", "reset"] as const;
type LoginError = (typeof LOGIN_ERRORS)[number];

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).login.title };
}

export default async function LoginPage({ searchParams }: PageProps<"/[lang]/inloggen">) {
  const [{ login: t }, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <>
      <PageHeader title={t.title} intro={t.intro} />
      <Section>
        <div className="max-w-md">
          {/* `?next=` comes from the request; the forms themselves stay in the static shell. */}
          <Suspense fallback={<LoginOptions locale={locale} t={t} />}>
            <LoginOptionsWithParams locale={locale} t={t} searchParams={searchParams} />
          </Suspense>
          <p className="mt-8 text-sm text-muted-foreground">
            {t.help}{" "}
            <a href={`mailto:${site.email}`} className="font-bold text-brand hover:underline">
              {site.email}
            </a>
            .
          </p>
        </div>
      </Section>
    </>
  );
}

function LoginOptions({
  locale,
  t,
  next,
  error,
}: {
  locale: Locale;
  t: Dictionary["login"];
  next?: string;
  /** Why the callback route sent the user back here. */
  error?: LoginError;
}) {
  const join = `/${locale}${routes.join}${next ? `?next=${encodeURIComponent(next)}` : ""}`;

  return (
    <div className="flex flex-col gap-6">
      {error && (
        <p role="alert" className="rounded-md bg-danger-muted px-4 py-3 text-sm font-semibold text-danger">
          {error === "google" ? t.googleFailed : error === "confirm" ? t.confirmFailed : t.resetFailed}
        </p>
      )}
      <GoogleSignIn locale={locale} label={t.google} pendingLabel={t.googlePending} next={next} />
      <p className="flex items-center gap-4 text-sm text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
        {t.or}
      </p>
      <LoginForm locale={locale} t={t} next={next} />
      <p className="text-sm text-muted-foreground">
        {t.noAccount}{" "}
        <Link href={join} className="font-bold text-brand hover:underline">
          {t.join}
        </Link>
      </p>
    </div>
  );
}

async function LoginOptionsWithParams({
  locale,
  t,
  searchParams,
}: {
  locale: Locale;
  t: Dictionary["login"];
  searchParams: PageProps<"/[lang]/inloggen">["searchParams"];
}) {
  const { next, error } = await searchParams;
  return (
    <LoginOptions
      locale={locale}
      t={t}
      next={safeNext(next)}
      error={LOGIN_ERRORS.find((e) => e === error)}
    />
  );
}
