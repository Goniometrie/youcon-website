import Link from "next/link";
import { ActivityCard } from "@/components/activity-card";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { getActivities } from "@/lib/activities";
import { routes } from "@/lib/site";

export default async function HomePage() {
  const [dict, locale, activities] = await Promise.all([
    getDictionary(),
    getLocale(),
    getActivities(),
  ]);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,var(--accent)_0%,transparent_55%)] opacity-25" />
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">
            {dict.home.eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            {dict.home.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            {dict.home.intro}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href={`/${locale}${routes.activities}`}
              className="rounded-full bg-brand px-6 py-3 font-semibold text-brand-foreground hover:opacity-90"
            >
              {dict.home.ctaActivities}
            </Link>
            <Link
              href={`/${locale}${routes.join}`}
              className="rounded-full border border-border px-6 py-3 font-semibold hover:bg-muted"
            >
              {dict.home.ctaJoin}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight">{dict.home.pillarsTitle}</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {dict.home.pillars.map((pillar) => (
            <div key={pillar.title} className="rounded-2xl bg-muted p-6">
              <h3 className="text-lg font-semibold">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {pillar.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight">{dict.home.upcomingTitle}</h2>
          <Link
            href={`/${locale}${routes.activities}`}
            className="text-sm font-semibold text-brand hover:underline"
          >
            {dict.home.allActivities} →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {activities.slice(0, 3).map((activity) => (
            <ActivityCard
              key={activity.slug}
              activity={activity}
              locale={locale}
              dict={dict.activities}
            />
          ))}
        </div>
      </section>
    </>
  );
}
