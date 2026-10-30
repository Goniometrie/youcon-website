import type { Metadata } from "next";
import { ActivityCard } from "@/components/activity-card";
import { PageHeader, Section } from "@/components/page-header";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { getActivities } from "@/lib/activities";
import { alternates } from "@/lib/seo";
import { routes } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).activities.title, alternates: await alternates(routes.activities) };
}

export default async function ActivitiesPage() {
  const [dict, locale, activities] = await Promise.all([
    getDictionary(),
    getLocale(),
    getActivities(),
  ]);

  return (
    <>
      <PageHeader title={dict.activities.title} intro={dict.activities.intro} />
      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity) => (
            <ActivityCard
              key={activity.slug}
              activity={activity}
              locale={locale}
              dict={dict.activities}
            />
          ))}
        </div>
      </Section>
    </>
  );
}
