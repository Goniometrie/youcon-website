import Link from "next/link";
import { notFound } from "next/navigation";
import { AddRegistrationForm, RemoveRegistrationButton } from "@/components/admin/registration-controls";
import { buttonClass } from "@/components/button";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { formatActivityDate, toActivity } from "@/lib/activities";
import { routes } from "@/lib/site";
import type { Tables } from "@/lib/supabase/database.types";
import { createSessionClient } from "@/lib/supabase/server";

// Like the edit page: the id is only known at runtime.
export const instant = false;

export default async function RegistrationsPage({
  params,
}: PageProps<"/[lang]/admin/activiteiten/[id]/aanmeldingen">) {
  const { id } = await params;
  const supabase = await createSessionClient();
  const [dict, locale, { data: row }, { data: registrations, error }, { data: accounts }] =
    await Promise.all([
    getDictionary(),
    getLocale(),
    supabase.from("activities").select("*").eq("id", id).maybeSingle(),
    // RLS: only staff see other people's registrations and profiles.
    supabase
      .from("registrations")
      .select(
        "created_at, profile_id, profile:profiles(first_name, last_name, full_name, email, company)",
      )
      .eq("activity_id", id)
      .order("created_at"),
    // For "add someone": everyone with an account.
    supabase
      .from("profiles")
      .select("id, first_name, last_name, full_name, email")
      .order("first_name", { nullsFirst: false }),
  ]);
  if (!row) notFound();
  if (error) throw error;

  const t = dict.admin.registrations;
  const activity = toActivity(row);
  const people = registrations.map(({ created_at, profile_id, profile }) => ({
    id: profile_id,
    name: nameOf(profile),
    company: profile.company ?? "",
    email: profile.email,
    date: new Intl.DateTimeFormat(locale === "nl" ? "nl-NL" : "en-GB", {
      timeZone: "Europe/Amsterdam",
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(created_at)),
  }));
  const onList = new Set(people.map((person) => person.id));
  const addable = (accounts ?? [])
    .filter((account) => !onList.has(account.id))
    .map((account) => {
      const name = nameOf(account);
      return { id: account.id, label: name ? `${name} (${account.email})` : account.email };
    });
  const count = (row.capacity ? t.countOf : people.length === 1 ? t.countOne : t.count)
    .replace("{count}", String(people.length))
    .replace("{capacity}", String(row.capacity));

  // Semicolons and a BOM, so Excel in Dutch opens it straight into columns.
  const csv = [
    [t.name, t.company, t.email, t.date],
    ...people.map((p) => [p.name, p.company, p.email, p.date]),
  ]
    .map((cells) => cells.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(";"))
    .join("\r\n");

  return (
    <div className="mx-auto max-w-site px-4 py-10 sm:px-6">
      <Link
        href={`/${locale}${routes.admin}`}
        className="text-sm font-bold text-brand hover:underline"
      >
        ← {dict.admin.form.back}
      </Link>
      <p className="mt-3 text-xs font-extrabold tracking-[0.14em] text-teal-500 uppercase">
        {t.title} · {formatActivityDate(activity, locale, { dateStyle: "long" })}
      </p>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight">{activity.title[locale]}</h1>
      <p className="mt-2 font-semibold text-body">{count}</p>

      {!row.registration_url && (
        <div className="mt-6 rounded-[10px] bg-white p-5 shadow-[0_1px_2px_rgba(23,50,61,0.06)] sm:p-6">
          <AddRegistrationForm activityId={row.id} people={addable} t={t} />
        </div>
      )}

      {people.length === 0 ? (
        <p className="mt-8 rounded-[10px] bg-white p-6 text-body">{t.empty}</p>
      ) : (
        <>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={`mailto:?bcc=${people.map((p) => p.email).join(",")}`}
              className={buttonClass("primary")}
            >
              {t.mailAll}
            </a>
            <a
              href={`data:text/csv;charset=utf-8,${encodeURIComponent(`﻿${csv}`)}`}
              download={`aanmeldingen-${row.slug}.csv`}
              className={buttonClass("ghost")}
            >
              {t.download}
            </a>
          </div>

          <div className="mt-6 overflow-x-auto rounded-[10px] bg-white shadow-[0_1px_2px_rgba(23,50,61,0.06)]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-divider text-xs font-bold tracking-widest text-muted-foreground uppercase">
                <tr>
                  <th scope="col" className="py-3 pr-2 pl-4 sm:pl-6">
                    <span className="sr-only">#</span>
                  </th>
                  <th scope="col" className="px-3 py-3">{t.name}</th>
                  <th scope="col" className="px-3 py-3">{t.company}</th>
                  <th scope="col" className="px-3 py-3">{t.email}</th>
                  <th scope="col" className="px-3 py-3">{t.date}</th>
                  <th scope="col" className="py-3 pr-4 pl-3 sm:pr-6">
                    <span className="sr-only">{t.remove}</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider">
                {people.map((person, index) => (
                  <tr key={person.id}>
                    <td className="py-3 pr-2 pl-4 text-muted-foreground tabular-nums sm:pl-6">
                      {index + 1}
                    </td>
                    <td className="px-3 py-3 font-bold">{person.name || "–"}</td>
                    <td className="px-3 py-3">{person.company || "–"}</td>
                    <td className="px-3 py-3">
                      <a href={`mailto:${person.email}`} className="text-brand hover:underline">
                        {person.email}
                      </a>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-muted-foreground">
                      {person.date}
                    </td>
                    <td className="py-2 pr-4 pl-3 text-right sm:pr-6">
                      <RemoveRegistrationButton
                        activityId={row.id}
                        profileId={person.id}
                        name={person.name || person.email}
                        t={t}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

/** "Voornaam Achternaam", or the older full name; empty when neither is known. */
const nameOf = (
  profile: Pick<Tables<"profiles">, "first_name" | "last_name" | "full_name">,
) => [profile.first_name, profile.last_name].filter(Boolean).join(" ") || profile.full_name || "";
