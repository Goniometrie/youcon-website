import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/page-header";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).partners.title };
}

export default async function PartnersPage() {
  const { partners: t } = await getDictionary();

  return (
    <>
      <PageHeader title={t.title} intro={t.intro} />
      <Section>
        <p className="text-muted-foreground">{t.comingSoon}</p>
      </Section>
    </>
  );
}
