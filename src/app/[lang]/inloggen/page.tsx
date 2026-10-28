import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader, Section } from "@/components/page-header";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { site } from "@/lib/site";
import { LoginForm } from "./login-form";

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
          {/* `?next=` comes from the request; the form itself stays in the static shell. */}
          <Suspense fallback={<LoginForm locale={locale} t={t} />}>
            <LoginFormWithNext locale={locale} t={t} searchParams={searchParams} />
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

async function LoginFormWithNext({
  locale,
  t,
  searchParams,
}: {
  locale: Locale;
  t: Dictionary["login"];
  searchParams: PageProps<"/[lang]/inloggen">["searchParams"];
}) {
  const { next } = await searchParams;
  return <LoginForm locale={locale} t={t} next={typeof next === "string" ? next : undefined} />;
}
