import type { Metadata } from "next";
import Link from "next/link";
import { buttonClass } from "@/components/button";
import { PageHeader, SectionTitle } from "@/components/page-header";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { routes } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const t = (await getDictionary()).mission;
  return { title: t.title, description: t.intro };
}

export default async function MissionPage() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  const t = dict.mission;

  return (
    <>
      <PageHeader title={t.title} intro={t.intro} />

      <section className="mx-auto grid max-w-site gap-6 px-4 pt-14 pb-6 sm:px-6 md:grid-cols-[1fr_2fr] md:gap-12 md:pt-20">
        <SectionTitle className="self-start text-[28px] text-foreground">
          {t.storyTitle}
        </SectionTitle>
        <div className="max-w-[680px] space-y-5 text-lg leading-[1.75] text-body">
          {t.story.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className="text-xl font-extrabold tracking-tight text-teal-700">{t.storyClosing}</p>
        </div>
      </section>

      <section className="mx-auto max-w-site px-4 pt-12 pb-20 sm:px-6 sm:pb-24">
        <SectionTitle className="text-[28px] text-foreground">{t.pointsTitle}</SectionTitle>
        <ol className="mt-10 grid gap-6 md:grid-cols-2">
          {t.points.map((point, index) => (
            <li
              key={point.title}
              className="relative overflow-hidden rounded-lg border border-border bg-white p-6 shadow-sm sm:p-8"
            >
              {/* Gevouwen hoekje rechtsboven */}
              <svg
                viewBox="0 0 40 40"
                aria-hidden="true"
                className="absolute top-0 right-0 size-10"
              >
                <polygon points="0,0 40,0 40,40" fill="#87cfce" />
                <polygon points="20,0 40,0 40,20" fill="#56929d" />
              </svg>
              <span
                aria-hidden="true"
                className="text-4xl leading-none font-extrabold tracking-tight text-teal-500"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-xl font-bold text-teal-700">{point.title}</h3>
              <p className="mt-2 leading-[1.7] text-body">{point.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-muted">
        <div className="mx-auto flex max-w-site flex-wrap items-center justify-between gap-8 px-4 py-14 sm:px-6">
          <div className="min-w-0 flex-[1_1_420px]">
            <h2 className="text-[28px] leading-tight font-extrabold tracking-tight text-teal-700">
              {t.ctaTitle}
            </h2>
            <p className="mt-2 max-w-[560px] text-lg leading-[1.65] text-body">{t.ctaText}</p>
          </div>
          <div className="flex flex-wrap gap-3.5">
            <Link href={`/${locale}${routes.join}`} className={buttonClass("primary")}>
              {dict.nav.join}
            </Link>
            <Link href={`/${locale}${routes.activities}`} className={buttonClass("outline")}>
              {t.ctaAgenda}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
