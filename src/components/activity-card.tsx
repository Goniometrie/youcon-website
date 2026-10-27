import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Activity } from "@/lib/activities";

export function ActivityCard({
  activity,
  locale,
  dict,
}: {
  activity: Activity;
  locale: Locale;
  dict: Dictionary["activities"];
}) {
  const date = new Date(`${activity.date}T12:00:00Z`);
  const intlLocale = locale === "nl" ? "nl-NL" : "en-GB";
  const fmt = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(intlLocale, { timeZone: "Europe/Amsterdam", ...options }).format(date);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-white shadow-sm transition-shadow hover:shadow-md">
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
            {fmt({ month: "short" }).replace(".", "")}
          </span>
          <span className="text-[10px] text-teal-100">{fmt({ year: "numeric" })}</span>
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
            <span className="text-teal-500">{dict.types[activity.type]}</span>
            {activity.englishSpoken && (
              <span className="rounded bg-teal-100/40 px-1.5 py-0.5 text-teal-600">
                {dict.englishSpoken}
              </span>
            )}
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

      <div className="px-6 pt-4 pb-6">
        {activity.registrationUrl ? (
          <a
            href={activity.registrationUrl}
            className="text-sm font-bold text-brand hover:underline"
          >
            {dict.register} →
          </a>
        ) : (
          <span className="h-5 block" />
        )}
      </div>
    </article>
  );
}
