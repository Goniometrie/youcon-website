import { AdminFormPage } from "@/components/admin/form-page";
import { ActivityForm } from "@/components/admin/activity-form";
import { getDictionary, getLocale } from "@/i18n/dictionaries";

export default async function NewActivityPage() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <AdminFormPage title={dict.admin.form.newTitle} back={dict.admin.form.back} locale={locale}>
      <ActivityForm locale={locale} dict={dict} />
    </AdminFormPage>
  );
}
