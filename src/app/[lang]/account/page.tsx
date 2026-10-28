import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { PageHeader, Section, SectionTitle } from "@/components/page-header";
import type { Locale } from "@/i18n/config";
import { type Dictionary, getDictionary, getLocale } from "@/i18n/dictionaries";
import { getCurrentProfile } from "@/lib/auth";
import { routes, site } from "@/lib/site";
import { NameForm, PasswordForm } from "./account-forms";

// Everything below the header waits on the session; signed-out visitors are
// redirected by the proxy.
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).account.title, robots: { index: false } };
}

export default async function AccountPage() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <>
      <PageHeader title={dict.account.title} intro={dict.account.intro} />
      <Suspense fallback={<div className="min-h-[50vh]" />}>
        <AccountDetails dict={dict} locale={locale} />
      </Suspense>
    </>
  );
}

const card = "rounded-lg border border-border bg-white p-6 sm:p-8";

async function AccountDetails({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const profile = await getCurrentProfile();
  if (!profile) redirect(`/${locale}${routes.login}`);
  const t = dict.account;
  const since = new Intl.DateTimeFormat(locale === "nl" ? "nl-NL" : "en-GB", {
    timeZone: "Europe/Amsterdam",
    dateStyle: "long",
  }).format(new Date(profile.created_at));

  return (
    <Section>
      <div className="grid max-w-3xl gap-8">
        <div className={card}>
          <SectionTitle className="text-xl text-teal-700">{t.details}</SectionTitle>
          <dl className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-[max-content_1fr]">
            <dt className="text-sm font-bold">{t.email}</dt>
            <dd className="text-body">
              {profile.email}
              <p className="mt-1 text-sm text-muted-foreground">
                {t.emailHint}{" "}
                <a href={`mailto:${site.email}`} className="font-bold text-brand hover:underline">
                  {site.email}
                </a>
                .
              </p>
            </dd>
            <dt className="text-sm font-bold">{t.role}</dt>
            <dd className="text-body">{t.roles[profile.role]}</dd>
            <dt className="text-sm font-bold">{t.since}</dt>
            <dd className="text-body">{since}</dd>
          </dl>
        </div>

        <div className={card}>
          <SectionTitle className="text-xl text-teal-700">{t.name}</SectionTitle>
          <NameForm t={t} name={profile.full_name ?? ""} />
        </div>

        <div className={card}>
          <SectionTitle className="text-xl text-teal-700">{t.password}</SectionTitle>
          <PasswordForm t={t} email={profile.email} />
        </div>
      </div>
    </Section>
  );
}
