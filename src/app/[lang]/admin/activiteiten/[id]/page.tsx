import { notFound } from "next/navigation";
import { ActivityForm } from "@/components/admin/activity-form";
import { DeleteActivityButton } from "@/components/admin/delete-activity-button";
import { AdminFormPage } from "@/components/admin/form-page";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { createSessionClient } from "@/lib/supabase/server";

// Activity ids are only known at runtime, so the header's pathname can't be
// prerendered; this admin-only page renders on the server per request.
export const instant = false;

export default async function EditActivityPage({
  params,
}: PageProps<"/[lang]/admin/activiteiten/[id]">) {
  const { id } = await params;
  const supabase = await createSessionClient();
  const [dict, locale, { data: activity }] = await Promise.all([
    getDictionary(),
    getLocale(),
    supabase.from("activities").select("*").eq("id", id).maybeSingle(),
  ]);
  if (!activity) notFound();
  const t = dict.admin;

  return (
    <AdminFormPage title={t.form.editTitle} back={t.form.back} locale={locale}>
      <ActivityForm locale={locale} dict={dict} activity={activity} />
      <div className="mt-10 border-t border-divider pt-6">
        <DeleteActivityButton
          id={activity.id}
          locale={locale}
          confirmMessage={t.activities.confirmDelete.replace("{title}", activity.title_nl)}
          label={t.activities.delete}
          pendingLabel={t.activities.deleting}
          yes={t.activities.confirmYes}
          no={t.activities.confirmNo}
        />
      </div>
    </AdminFormPage>
  );
}
