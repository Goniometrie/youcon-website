import type { Metadata } from "next";
import Link from "next/link";
import { GoogleSignIn } from "@/components/google-sign-in";
import { PageHeader, Section } from "@/components/page-header";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { routes } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).join.title };
}

export default async function JoinPage() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  const t = dict.join;

  return (
    <>
      <PageHeader title={t.title} intro={t.intro} />
      <Section>
        <div className="max-w-md">
          <p className="text-body">{t.signUp}</p>
          <div className="mt-6">
            <GoogleSignIn
              locale={locale}
              label={dict.login.google}
              pendingLabel={dict.login.googlePending}
            />
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            {t.withoutGoogle}{" "}
            <Link href={`/${locale}${routes.contact}`} className="font-bold text-brand hover:underline">
              {t.contact}
            </Link>
            .
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            <Link href={`/${locale}${routes.privacy}`} className="font-bold text-brand hover:underline">
              {t.privacy}
            </Link>
          </p>
        </div>
      </Section>
    </>
  );
}
