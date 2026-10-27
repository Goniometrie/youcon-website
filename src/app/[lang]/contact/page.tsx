import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/page-header";
import { getDictionary } from "@/i18n/dictionaries";
import { site } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).contact.title };
}

export default async function ContactPage() {
  const { contact: t } = await getDictionary();

  return (
    <>
      <PageHeader title={t.title} intro={t.intro} />
      <Section>
        <dl className="space-y-4">
          <div>
            <dt className="text-sm font-semibold">{t.emailLabel}</dt>
            <dd>
              <a href={`mailto:${site.email}`} className="text-brand hover:underline">
                {site.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-semibold">LinkedIn</dt>
            <dd>
              <a href={site.linkedin} className="text-brand hover:underline">
                linkedin.com/company/youcon
              </a>
            </dd>
          </div>
        </dl>
      </Section>
    </>
  );
}
