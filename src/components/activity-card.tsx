import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { LanguageBadge } from "@/components/language-badge";
import { Registration } from "@/components/registration";
import { formatActivityDate, type Activity } from "@/lib/activities";
import { routes } from "@/lib/site";

export function ActivityCard({
  activity,
  locale,
  dict,
}: {
  activity: Activity;
  locale: Locale;
  dict: Dictionary["activities"];
}) {
  const fmt = (options: Intl.DateTimeFormatOptions) =>
    formatActivityDate(activity, locale, options);

  return (
    <article
      id={activity.slug}
      className="group relative flex scroll-mt-6 flex-col overflow-hidden rounded-lg border border-border bg-white shadow-sm transition-shadow hover:shadow-md"
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

      <div className="flex gap-4 p-6">
        <div className="flex w-14 shrink-0 flex-col self-start items-center rounded-md bg-teal-600 py-2 text-white">
          <span className="text-2xl leading-none font-extrabold">{fmt({ day: "numeric" })}</span>
          <span className="mt-1 text-[11px] font-semibold uppercase">
            {fmt({ month: "short" })}
          </span>
          <span className="text-[10px] text-teal-100">{fmt({ year: "numeric" })}</span>
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
            <span className="text-teal-500">{dict.types[activity.type]}</span>
            <LanguageBadge language={activity.language} dict={dict} className="text-teal-600" />
          </div>
          <h3 className="mt-1 pr-6 text-lg leading-snug font-bold text-teal-800">
            {activity.title[locale]}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {fmt({ weekday: "long" })}
            {activity.time && ` · ${activity.time}`} · {activity.location}
          </p>
        </div>
      </div>

      <p className="flex-1 px-6 text-sm leading-6">{activity.summary[locale]}</p>

      <div className="flex min-h-5 flex-wrap items-center gap-x-3 gap-y-1 px-6 pt-4 pb-6">
        <Registration
          activity={activity}
          locale={locale}
          dict={dict}
          returnTo={`/${locale}${routes.activities}#${activity.slug}`}
          variant="link"
        />
      </div>
    </article>
  );
}
