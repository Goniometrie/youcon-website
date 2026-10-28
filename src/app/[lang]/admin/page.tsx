import Link from "next/link";
import { DeleteActivityButton } from "@/components/admin/delete-activity-button";
import { buttonClass } from "@/components/button";
import { SectionTitle } from "@/components/page-header";
import type { Locale } from "@/i18n/config";
import { getDictionary, getLocale, type Dictionary } from "@/i18n/dictionaries";
import { formatActivityDate, toActivity, today } from "@/lib/activities";
import { routes } from "@/lib/site";
import type { Tables } from "@/lib/supabase/database.types";
import { createSessionClient } from "@/lib/supabase/server";

export default async function AdminPage({ searchParams }: PageProps<"/[lang]/admin">) {
  const supabase = await createSessionClient();
  const [dict, locale, { status }, { data: rows, error }] = await Promise.all([
    getDictionary(),
    getLocale(),
    searchParams,
    // RLS shows staff drafts too, and everyone's registrations.
    supabase
      .from("activities")
      .select("*, registrations(count)")
      .order("date", { ascending: false }),
  ]);
  if (error) throw error;

  const t = dict.admin.activities;
  const now = today();
  const upcoming = rows.filter((row) => row.date >= now).toReversed();
  const past = rows.filter((row) => row.date < now);
  const message = status === "saved" ? t.saved : status === "deleted" ? t.deleted : null;

  return (
    <div className="mx-auto max-w-site px-4 py-10 sm:px-6">
      {message && (
        <p
          role="status"
          className="mb-6 flex items-center gap-2 rounded-md border-l-4 border-teal-400 bg-white px-4 py-3 font-semibold"
        >
          <span aria-hidden="true" className="text-teal-500">✓</span>
          {message}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <SectionTitle className="text-[28px] text-foreground">{t.title}</SectionTitle>
        <Link href={`/${locale}${routes.adminActivities}/nieuw`} className={buttonClass("primary")}>
          <span aria-hidden="true" className="text-xl leading-none">+</span>
          {t.new}
        </Link>
      </div>

      {rows.length === 0 && <p className="mt-8 text-body">{t.empty}</p>}

      {[
        { title: t.upcoming, rows: upcoming },
        { title: t.past, rows: past },
      ]
        .filter((group) => group.rows.length > 0)
        .map((group) => (
          <section key={group.title} className="mt-10">
            <h2 className="text-xs font-extrabold tracking-[0.14em] text-teal-500 uppercase">
              {group.title}
            </h2>
            <ul className="mt-3 divide-y divide-divider overflow-hidden rounded-[10px] bg-white shadow-[0_1px_2px_rgba(23,50,61,0.06)]">
              {group.rows.map((row) => (
                <AdminRow key={row.id} row={row} locale={locale} dict={dict} />
              ))}
            </ul>
          </section>
        ))}
    </div>
  );
}

function AdminRow({
  row,
  locale,
  dict,
}: {
  row: Tables<"activities"> & { registrations: { count: number }[] };
  locale: Locale;
  dict: Dictionary;
}) {
  const t = dict.admin.activities;
  const activity = toActivity(row);
  const fmt = (options: Intl.DateTimeFormatOptions) =>
    formatActivityDate(activity, locale, options);
  const editHref = `/${locale}${routes.adminActivities}/${row.id}`;
  const registrations = row.registrations[0]?.count ?? 0;

  return (
    <li className="flex flex-wrap items-center gap-x-5 gap-y-3 px-4 py-4 sm:px-6">
      <span className="w-[60px] flex-none rounded-md border border-input py-2 text-center">
        <span className="block text-2xl leading-none font-extrabold">{fmt({ day: "numeric" })}</span>
        <span className="mt-0.5 block text-xs font-bold text-teal-500 uppercase">
          {fmt({ month: "short" })} {fmt({ year: "2-digit" })}
        </span>
      </span>
      <div className="min-w-0 flex-[1_1_240px]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-extrabold tracking-[0.12em] text-teal-500 uppercase">
            {dict.activities.types[row.type]}
          </span>
          {!row.published && (
            <span className="rounded bg-grey-50 px-2 py-0.5 text-xs font-bold text-body">
              {t.draft}
            </span>
          )}
        </div>
        <Link href={editHref} className="mt-0.5 block text-[17px] font-bold hover:text-brand">
          {activity.title[locale]}
        </Link>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {[fmt({ weekday: "short" }), activity.time ?? t.noTime, activity.location].join(" · ")}
        </p>
      </div>
      {!row.registration_url && (
        <Link
          href={`${editHref}/aanmeldingen`}
          className="text-sm font-bold whitespace-nowrap text-brand hover:underline"
        >
          {(row.capacity
            ? t.registrationsOf
            : registrations === 1
              ? t.registrationsOne
              : t.registrations)
            .replace("{count}", String(registrations))
            .replace("{capacity}", String(row.capacity))}
        </Link>
      )}
      <div className="flex items-center gap-2">
        <Link href={editHref} className={`${buttonClass("ghost")} min-h-10 px-4 text-sm`}>
          {t.edit}
        </Link>
        <DeleteActivityButton
          id={row.id}
          locale={locale}
          confirmMessage={t.confirmDelete.replace("{title}", activity.title[locale])}
          label={t.delete}
          pendingLabel={t.deleting}
          yes={t.confirmYes}
          no={t.confirmNo}
        />
      </div>
    </li>
  );
}
