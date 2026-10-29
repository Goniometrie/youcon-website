import type { Metadata } from "next";
import { Suspense } from "react";
import { GoogleSignIn } from "@/components/google-sign-in";
import { PageHeader, Section } from "@/components/page-header";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { site } from "@/lib/site";
import { LoginForm } from "./login-form";
import { safeNext } from "./next";

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
            {t.forgotten}{" "}
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
  googleFailed,
}: {
  locale: Locale;
  t: Dictionary["login"];
  next?: string;
  googleFailed?: boolean;
}) {
  return (
    <div className="flex flex-col gap-6">
      {googleFailed && (
        <p role="alert" className="rounded-md bg-danger-muted px-4 py-3 text-sm font-semibold text-danger">
          {t.googleFailed}
        </p>
      )}
      <GoogleSignIn locale={locale} label={t.google} pendingLabel={t.googlePending} next={next} />
      <p className="flex items-center gap-4 text-sm text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
        {t.or}
      </p>
      <LoginForm locale={locale} t={t} next={next} />
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
    <LoginOptions locale={locale} t={t} next={safeNext(next)} googleFailed={error === "google"} />
  );
}
