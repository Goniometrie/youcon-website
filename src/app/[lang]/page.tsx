import Link from "next/link";
import { ActivityCard } from "@/components/activity-card";
import { Facets } from "@/components/facets";
import { SectionTitle } from "@/components/page-header";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { getActivities } from "@/lib/activities";
import { routes } from "@/lib/site";

const PILLAR_COLORS = ["bg-teal-200", "bg-teal-400", "bg-teal-600"];

export default async function HomePage() {
  const [dict, locale, activities] = await Promise.all([
    getDictionary(),
    getLocale(),
    getActivities(),
  ]);

  return (
    <>
      <section className="edge-slant relative overflow-hidden bg-muted">
        <Facets
          cols={8}
          rows={5}
          greys
          className="pointer-events-none absolute inset-y-0 right-0 h-full w-full opacity-20 fade-left lg:w-1/2 lg:opacity-100"
        />
        <div className="relative mx-auto max-w-6xl px-4 pt-20 pb-28 sm:px-6 sm:pt-28 sm:pb-36">
          <div className="max-w-xl lg:max-w-lg xl:max-w-xl">
            <p className="text-sm font-bold uppercase tracking-widest text-teal-500">
              {dict.home.eyebrow}
            </p>
            <h1 className="mt-4 text-4xl leading-tight font-extrabold tracking-tight text-teal-800 sm:text-5xl">
              {dict.home.title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              {dict.home.intro}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={`/${locale}${routes.activities}`}
                className="rounded-md bg-brand px-6 py-3 font-bold text-brand-foreground transition-colors hover:bg-brand-hover"
              >
                {dict.home.ctaActivities}
              </Link>
              <Link
                href={`/${locale}${routes.join}`}
                className="rounded-md border-2 border-teal-600 bg-white px-6 py-3 font-bold text-teal-600 transition-colors hover:bg-teal-600 hover:text-white"
              >
                {dict.home.ctaJoin}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionTitle>{dict.home.pillarsTitle}</SectionTitle>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {dict.home.pillars.map((pillar, i) => (
            <div key={pillar.title} className="relative border-l-4 border-border pl-6">
              <span
                className={`absolute top-0 -left-1 h-10 w-1 ${PILLAR_COLORS[i % PILLAR_COLORS.length]}`}
              />
              <h3 className="text-lg font-bold text-teal-800">{pillar.title}</h3>
              <p className="mt-2 leading-7 text-muted-foreground">{pillar.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <SectionTitle>{dict.home.upcomingTitle}</SectionTitle>
            <Link
              href={`/${locale}${routes.activities}`}
              className="text-sm font-bold text-brand hover:underline"
            >
              {dict.home.allActivities} →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activities.slice(0, 3).map((activity) => (
              <ActivityCard
                key={activity.slug}
                activity={activity}
                locale={locale}
                dict={dict.activities}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
