import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Section } from "@/components/page-header";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { routes } from "@/lib/site";
import { ResetRequestForm } from "./reset-request-form";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).password.forgotTitle, robots: { index: false } };
}

export default async function ForgotPasswordPage() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  const t = dict.password;

  return (
    <>
      <PageHeader title={t.forgotTitle} intro={t.forgotIntro} />
      <Section>
        <div className="max-w-md">
          <ResetRequestForm locale={locale} t={t} emailLabel={dict.login.email} />
          <p className="mt-8 text-sm">
            <Link href={`/${locale}${routes.login}`} className="font-bold text-brand hover:underline">
              {t.backToLogin}
            </Link>
          </p>
        </div>
      </Section>
    </>
  );
}
