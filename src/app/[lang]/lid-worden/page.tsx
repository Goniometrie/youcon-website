import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Section } from "@/components/page-header";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { routes } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).join.title };
}

export default async function JoinPage() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <>
      <PageHeader title={dict.join.title} intro={dict.join.intro} />
      <Section>
        <p className="text-muted-foreground">{dict.join.comingSoon}</p>
        <Link
          href={`/${locale}${routes.contact}`}
          className="mt-6 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-brand-foreground hover:opacity-90"
        >
          {dict.nav.contact}
        </Link>
      </Section>
    </>
  );
}
