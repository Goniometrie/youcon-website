import Image from "next/image";
import Link from "next/link";
import { buttonClass } from "@/components/button";
import { LanguageBadge } from "@/components/language-badge";
import { Registration } from "@/components/registration";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { calendarUrl, formatActivityDate, type Activity } from "@/lib/activities";
import { routes } from "@/lib/site";

/** Grote kaart voor de eerstvolgende activiteit, met foto en details. */
export function FeaturedActivity({
  activity,
  locale,
  dict,
}: {
  activity: Activity;
  locale: Locale;
  dict: Dictionary;
}) {
  const fmt = (options: Intl.DateTimeFormatOptions) =>
    formatActivityDate(activity, locale, options);
  const details = [
    { label: dict.home.agenda.time, value: activity.time },
    { label: dict.home.agenda.location, value: activity.location },
    { label: dict.home.agenda.partner, value: activity.partner },
  ].filter((detail) => detail.value);

  return (
    <article className="min-w-0 flex-[999_1_560px] overflow-hidden rounded-[10px] bg-white shadow-[0_1px_2px_rgba(23,50,61,0.06),0_12px_32px_rgba(23,50,61,0.08)]">
      <div className="relative aspect-video bg-border">
        {activity.image && (
          <Image
            src={activity.image.src}
            alt={activity.image.alt[locale]}
            fill
            preload
            sizes="(min-width: 1200px) 760px, (min-width: 1024px) 62vw, 100vw"
            className="object-cover"
          />
        )}
        <span className="absolute top-6 left-0 bg-white py-2.5 pr-7 pl-5 text-[13px] font-extrabold tracking-[0.14em] text-brand uppercase [clip-path:polygon(0_0,100%_0,calc(100%_-_14px)_100%,0_100%)]">
          {dict.home.agenda.next}
        </span>
      </div>

      <div className="flex flex-wrap gap-7 p-6 sm:p-8">
        <div className="flex w-24 flex-none flex-col items-center self-start rounded-lg bg-brand pt-3.5 pb-3 text-white">
          <span className="text-[13px] font-bold text-teal-100 uppercase">
            {fmt({ weekday: "short" })}
          </span>
          <span className="text-[44px] leading-none font-extrabold">{fmt({ day: "numeric" })}</span>
          <span className="text-sm font-bold uppercase">{fmt({ month: "short" })}</span>
          <span className="text-xs text-white/75">{fmt({ year: "numeric" })}</span>
        </div>

        <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-3.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-extrabold tracking-[0.14em] text-teal-500 uppercase">
              {dict.activities.types[activity.type]}
            </span>
            <LanguageBadge
              language={activity.language}
              dict={dict.activities}
              className="px-2 text-xs text-brand"
            />
          </div>
          <h2 className="text-[clamp(28px,3vw,40px)] leading-[1.1] font-extrabold tracking-[-0.02em]">
            {activity.title[locale]}
          </h2>
          <p className="text-[17px] leading-[1.65] text-body">{activity.summary[locale]}</p>
          <dl className="mt-1 grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4 border-t border-divider pt-[18px]">
            {details.map((detail) => (
              <div key={detail.label}>
                <dt className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                  {detail.label}
                </dt>
                <dd className="mt-1 font-bold">{detail.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-1.5 flex flex-wrap gap-3">
            <Registration
              activity={activity}
              locale={locale}
              dict={dict.activities}
              returnTo={`/${locale}`}
              variant="button"
            />
            <a
              href={calendarUrl(activity, locale)}
              download={`${activity.slug}.ics`}
              className={buttonClass("ghost")}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-[18px]"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              {dict.home.agenda.addToCalendar}
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

/** Regel in de agendalijst naast de uitgelichte activiteit. */
export function AgendaRow({
  activity,
  locale,
  dict,
}: {
  activity: Activity;
  locale: Locale;
  dict: Dictionary;
}) {
  const fmt = (options: Intl.DateTimeFormatOptions) =>
    formatActivityDate(activity, locale, options);
  const meta = [fmt({ weekday: "short" }), activity.time, activity.location].filter(Boolean);

  return (
    <Link
      href={`/${locale}${routes.activities}#${activity.slug}`}
      className="group flex items-center gap-[18px] border-b border-divider py-[18px]"
    >
      <span className="w-[60px] flex-none rounded-md border border-input bg-white py-2 text-center">
        <span className="block text-2xl leading-none font-extrabold">{fmt({ day: "numeric" })}</span>
        <span className="mt-0.5 block text-xs font-bold text-teal-500 uppercase">
          {fmt({ month: "short" })}
        </span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-extrabold tracking-[0.12em] text-teal-500 uppercase">
            {dict.activities.types[activity.type]}
          </span>
          <LanguageBadge
            language={activity.language}
            dict={dict.activities}
            className="text-[11px] text-brand"
          />
        </span>
        <span className="mt-0.5 block text-[17px] font-bold transition-colors group-hover:text-brand">
          {activity.title[locale]}
        </span>
        <span className="mt-0.5 block text-sm text-muted-foreground">{meta.join(" · ")}</span>
      </span>
      <span
        aria-hidden="true"
        className="text-xl font-bold text-brand transition-transform group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}
