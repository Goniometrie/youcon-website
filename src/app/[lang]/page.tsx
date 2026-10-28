import Link from "next/link";
import { AgendaRow, FeaturedActivity } from "@/components/agenda";
import { buttonClass } from "@/components/button";
import { NewsletterBand } from "@/components/newsletter-band";
import { SectionTitle } from "@/components/page-header";
import { PhotoMosaic } from "@/components/photo-mosaic";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { getAgenda } from "@/lib/activities";
import { routes } from "@/lib/site";

export default async function HomePage() {
  const [dict, locale, agenda] = await Promise.all([
    getDictionary(),
    getLocale(),
    getAgenda(),
  ]);

  return (
    <>
      <h1 className="sr-only">{dict.meta.title}</h1>

      {/* Agenda eerst: de eerstvolgende activiteit en wat daarna komt. */}
      <section className="bg-muted">
        <div className="mx-auto flex max-w-site flex-wrap items-start gap-10 px-4 pt-8 pb-16 sm:px-6 sm:pt-12 sm:pb-[72px]">
          {agenda.featured && (
            <FeaturedActivity activity={agenda.featured} locale={locale} dict={dict} />
          )}

          <aside className="flex min-w-0 flex-[1_1_340px] flex-col">
            <SectionTitle className="text-[28px] text-foreground">
              {dict.home.agenda.title}
            </SectionTitle>
            <div className="mt-3">
              {agenda.upcoming.map((activity) => (
                <AgendaRow key={activity.slug} activity={activity} locale={locale} dict={dict} />
              ))}
              {agenda.upcoming.length === 0 && (
                <p className="border-b border-divider py-[18px] text-body">
                  {dict.home.agenda.empty}
                </p>
              )}
            </div>
            <Link
              href={`/${locale}${routes.activities}`}
              className="mt-5 font-bold text-brand hover:text-brand-hover"
            >
              {dict.home.agenda.all} →
            </Link>
          </aside>
        </div>
      </section>

      {/* Wie we zijn, met het fotomozaïek in driehoekstegels. */}
      <section className="mx-auto flex max-w-site flex-wrap items-center gap-14 px-4 pt-16 pb-20 sm:px-6 sm:pt-[88px] sm:pb-24">
        <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-6">
          <p className="text-[13px] font-bold tracking-[0.2em] text-teal-500 uppercase">
            {dict.home.community.eyebrow}
          </p>
          <h2 className="text-[clamp(36px,4.4vw,60px)] leading-[1.05] font-extrabold tracking-[-0.025em]">
            {dict.home.community.title}{" "}
            <span className="text-teal-500">{dict.home.community.titleAccent}</span>
          </h2>
          <p className="max-w-[520px] text-lg leading-[1.65] text-body">
            {dict.home.community.text}
          </p>
          <div className="flex flex-wrap gap-3.5">
            <Link href={`/${locale}${routes.join}`} className={buttonClass("primary")}>
              {dict.nav.join}
            </Link>
            <Link
              href={`/${locale}${routes.association}#bestuur`}
              className={buttonClass("outline")}
            >
              {dict.home.community.board}
            </Link>
          </div>
        </div>
        <PhotoMosaic className="min-w-0 flex-[1_1_460px]" />
      </section>

      <NewsletterBand dict={dict.home.newsletter} />
    </>
  );
}
