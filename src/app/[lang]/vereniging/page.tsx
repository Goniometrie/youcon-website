import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/page-header";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).association.title };
}

export default async function AssociationPage() {
  const { association: t } = await getDictionary();
  const blocks = [
    { id: "missie", title: t.missionTitle, text: t.missionText },
    { id: "bestuur", title: t.boardTitle, text: t.boardText },
    { id: "geschiedenis", title: t.historyTitle, text: t.historyText },
  ];

  return (
    <>
      <PageHeader title={t.title} intro={t.intro} />
      <Section>
        <div className="grid gap-10 md:grid-cols-3">
          {blocks.map((block) => (
            <div key={block.id} id={block.id}>
              <h2 className="text-xl font-semibold">{block.title}</h2>
              <p className="mt-2 text-muted-foreground">{block.text}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
