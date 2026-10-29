import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { GoogleSignIn } from "@/components/google-sign-in";
import { PageHeader, Section } from "@/components/page-header";
import type { Locale } from "@/i18n/config";
import { type Dictionary, getDictionary, getLocale } from "@/i18n/dictionaries";
import { alternates } from "@/lib/seo";
import { routes } from "@/lib/site";
import { safeNext } from "../inloggen/next";
import { EmailSignUp } from "./signup-form";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).join.title, alternates: await alternates(routes.join) };
}

export default async function JoinPage({ searchParams }: PageProps<"/[lang]/lid-worden">) {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  const t = dict.join;

  return (
    <>
      <PageHeader title={t.heading} intro={t.intro} />
      <Section>
        <div className="mx-auto max-w-xl">
          <p className="text-center text-body">{t.signUp}</p>
          {/* `?next=` comes from the request; the forms themselves stay in the static shell. */}
          <Suspense fallback={<JoinOptions locale={locale} dict={dict} />}>
            <JoinOptionsWithParams locale={locale} dict={dict} searchParams={searchParams} />
          </Suspense>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            <Link href={`/${locale}${routes.privacy}`} className="font-bold text-brand hover:underline">
              {t.privacy}
            </Link>
          </p>
        </div>
      </Section>
    </>
  );
}

function JoinOptions({ locale, dict, next }: { locale: Locale; dict: Dictionary; next?: string }) {
  const t = dict.join;
  const login = `/${locale}${routes.login}${next ? `?next=${encodeURIComponent(next)}` : ""}`;

  return (
    <div className="mt-6 flex flex-col gap-3">
      <GoogleSignIn
        locale={locale}
        label={dict.login.google}
        pendingLabel={dict.login.googlePending}
        next={next}
      />
      <EmailSignUp locale={locale} t={t} account={dict.account} next={next} />
      <p className="mt-3 text-center text-sm text-muted-foreground">
        {t.haveAccount}{" "}
        <Link href={login} className="font-bold text-brand hover:underline">
          {t.login}
        </Link>
      </p>
    </div>
  );
}

async function JoinOptionsWithParams({
  locale,
  dict,
  searchParams,
}: {
  locale: Locale;
  dict: Dictionary;
  searchParams: PageProps<"/[lang]/lid-worden">["searchParams"];
}) {
  const { next } = await searchParams;
  return <JoinOptions locale={locale} dict={dict} next={safeNext(next)} />;
}
