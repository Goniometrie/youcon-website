import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Notice } from "@/components/notice";
import { PageHeader, Section } from "@/components/page-header";
import type { Locale } from "@/i18n/config";
import { type Dictionary, getDictionary, getLocale } from "@/i18n/dictionaries";
import { getCurrentProfile } from "@/lib/auth";
import { routes } from "@/lib/site";
import { NewPasswordForm } from "./new-password-form";

// The form waits on the session from the reset link.
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).password.newTitle, robots: { index: false } };
}

export default async function NewPasswordPage() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <>
      <PageHeader title={dict.password.newTitle} intro={dict.password.newIntro} />
      <Section>
        <div className="max-w-md">
          <Suspense fallback={<div className="min-h-64" />}>
            <NewPassword dict={dict} locale={locale} />
          </Suspense>
        </div>
      </Section>
    </>
  );
}

/** The reset link signs the user in; without a session it has run out. */
async function NewPassword({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const profile = await getCurrentProfile();
  const t = dict.password;

  if (!profile) {
    return (
      <div className="flex flex-col gap-4">
        <Notice tone="error">{t.errors.expired}</Notice>
        <Link
          href={`/${locale}${routes.forgotPassword}`}
          className="self-start font-bold text-brand hover:underline"
        >
          {t.requestNew}
        </Link>
      </div>
    );
  }

  return <NewPasswordForm locale={locale} t={t} account={dict.account} email={profile.email} />;
}
