import type { Metadata } from "next";
import Link from "next/link";
import { buttonClass } from "@/components/button";
import { PageHeader, SectionTitle } from "@/components/page-header";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { founders } from "@/lib/founders";
import { alternates } from "@/lib/seo";
import { routes } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const t = (await getDictionary()).history;
  return { title: t.title, description: t.intro, alternates: await alternates(routes.history) };
}

export default async function HistoryPage() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  const t = dict.history;

  return (
    <>
      <PageHeader title={t.title} intro={t.intro} />

      <section className="mx-auto grid max-w-site gap-8 px-4 pt-14 pb-6 sm:px-6 md:grid-cols-[1fr_2fr] md:gap-12 md:pt-20">
        <SectionTitle className="self-start text-[28px] text-foreground">
          {t.timelineTitle}
        </SectionTitle>
        <ol className="max-w-[680px] border-l-2 border-divider">
          {t.moments.map((moment) => (
            <li key={moment.title} className="relative pb-12 pl-8 last:pb-0 sm:pl-10">
              {/* Gevouwen driehoekje op de tijdlijn */}
              <svg
                viewBox="0 0 12 20"
                aria-hidden="true"
                className="absolute top-1 -left-[7px] h-5 w-3"
              >
                <polygon points="0,0 12,0 12,20" fill="#87cfce" />
                <polygon points="0,0 12,20 0,20" fill="#447d8e" />
              </svg>
              <p className="text-[13px] font-bold tracking-wider text-teal-500 uppercase">
                {moment.date}
              </p>
              <h3 className="mt-1 text-xl font-bold text-teal-700">{moment.title}</h3>
              <div className="mt-3 space-y-4 text-lg leading-[1.75] text-body">
                {moment.text.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-site px-4 pt-14 pb-20 sm:px-6 sm:pb-24">
        <SectionTitle className="text-[28px] text-foreground">{t.foundersTitle}</SectionTitle>
        <p className="mt-3 text-lg text-body">{t.foundersIntro}</p>
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {founders.map((founder) => (
            <li
              key={founder.name}
              className="rounded-lg border border-border bg-white p-5 shadow-sm"
            >
              <p className="font-bold text-teal-800">{founder.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{founder.organisation}</p>
              {founder.initiator && (
                <p className="mt-2 text-[11px] font-bold tracking-wider text-teal-500 uppercase">
                  {t.initiator}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-muted">
        <div className="mx-auto flex max-w-site flex-wrap items-center justify-between gap-8 px-4 py-14 sm:px-6">
          <div className="min-w-0 flex-[1_1_420px]">
            <h2 className="text-[28px] leading-tight font-extrabold tracking-tight text-teal-700">
              {t.todayTitle}
            </h2>
            <p className="mt-2 max-w-[560px] text-lg leading-[1.65] text-body">{t.todayText}</p>
          </div>
          <div className="flex flex-wrap gap-3.5">
            <Link href={`/${locale}${routes.board}`} className={buttonClass("primary")}>
              {dict.home.community.board}
            </Link>
            <Link href={`/${locale}${routes.mission}`} className={buttonClass("outline")}>
              {t.missionLink}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
