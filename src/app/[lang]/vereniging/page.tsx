import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Section } from "@/components/page-header";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { routes } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).association.title };
}

export default async function AssociationPage() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  const t = dict.association;
  const blocks = [
    { id: "missie", title: t.missionTitle, text: t.missionText },
    {
      id: "bestuur",
      title: t.boardTitle,
      text: t.boardText,
      link: { href: `/${locale}${routes.board}`, label: dict.home.community.board },
    },
    { id: "geschiedenis", title: t.historyTitle, text: t.historyText },
  ];

  return (
    <>
      <PageHeader title={t.title} intro={t.intro} />
      <Section>
        <div className="grid gap-10 md:grid-cols-3">
          {blocks.map((block) => (
            <div key={block.id} id={block.id}>
              <h2 className="text-xl font-bold text-teal-700">{block.title}</h2>
              <p className="mt-2 text-muted-foreground">{block.text}</p>
              {block.link && (
                <Link
                  href={block.link.href}
                  className="mt-3 inline-block font-bold text-brand hover:text-brand-hover"
                >
                  {block.link.label} →
                </Link>
              )}
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
