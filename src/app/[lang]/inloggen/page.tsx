import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/page-header";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).login.title };
}

// Placeholder until Supabase Auth is added.
export default async function LoginPage() {
  const { login: t } = await getDictionary();

  return (
    <>
      <PageHeader title={t.title} />
      <Section>
        <p className="text-muted-foreground">{t.comingSoon}</p>
      </Section>
    </>
  );
}
