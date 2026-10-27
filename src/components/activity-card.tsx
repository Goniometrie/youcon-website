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
  const date = new Intl.DateTimeFormat(locale === "nl" ? "nl-NL" : "en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Amsterdam",
  }).format(new Date(`${activity.date}T12:00:00Z`));

  return (
    <article className="flex flex-col rounded-2xl border border-border bg-background p-6">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide">
        <span className="rounded-full bg-brand/10 px-2.5 py-1 text-brand">
          {dict.types[activity.type]}
        </span>
        {activity.englishSpoken && (
          <span className="rounded-full bg-accent/15 px-2.5 py-1 text-accent">
            {dict.englishSpoken}
          </span>
        )}
      </div>
      <h3 className="mt-4 text-lg font-semibold">{activity.title[locale]}</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {date}
        {activity.time && ` · ${activity.time}`} · {activity.location}
      </p>
      <p className="mt-3 flex-1 text-sm leading-6">{activity.summary[locale]}</p>
      {activity.registrationUrl && (
        <a
          href={activity.registrationUrl}
          className="mt-4 text-sm font-semibold text-brand hover:underline"
        >
          {dict.register} →
        </a>
      )}
    </article>
  );
}
