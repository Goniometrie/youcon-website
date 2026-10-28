import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/page-header";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { site } from "@/lib/site";
import { LoginForm } from "./login-form";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).login.title };
}

export default async function LoginPage() {
  const [{ login: t }, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <>
      <PageHeader title={t.title} intro={t.intro} />
      <Section>
        <div className="max-w-md">
          <LoginForm locale={locale} t={t} />
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
