import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/page-header";
import { getDictionary } from "@/i18n/dictionaries";
import { alternates } from "@/lib/seo";
import { routes } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).privacy.title, alternates: await alternates(routes.privacy) };
}

export default async function PrivacyPage() {
  const { privacy: t } = await getDictionary();

  return (
    <>
      <PageHeader title={t.title} intro={t.intro} />
      <Section>
        <div className="max-w-2xl">
          <p className="text-sm text-muted-foreground">{t.updated}</p>
          {t.sections.map((section) => (
            <div key={section.title} className="mt-10">
              <h2 className="text-xl font-bold text-teal-700">{section.title}</h2>
              {section.text.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-body">
                  {paragraph}
                </p>
              ))}
              {section.list.length > 0 && (
                <ul className="mt-3 list-disc space-y-1 pl-6 text-body">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
