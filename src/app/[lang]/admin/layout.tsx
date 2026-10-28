import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Section } from "@/components/page-header";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { getCurrentProfile, isStaff } from "@/lib/auth";
import { routes } from "@/lib/site";
import { signOut } from "../inloggen/actions";

// Everything here waits on the session, so instant-navigation validation
// has nothing to check; signed-out visitors are redirected by the proxy.
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).admin.title, robots: { index: false } };
}

export default function AdminLayout({ children }: LayoutProps<"/[lang]/admin">) {
  // The session read streams in behind this boundary; the site chrome around
  // it stays in the static shell.
  return (
    <Suspense fallback={<div className="min-h-[60vh] bg-muted" />}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}

async function AdminShell({ children }: { children: React.ReactNode }) {
  const [profile, dict, locale] = await Promise.all([
    getCurrentProfile(),
    getDictionary(),
    getLocale(),
  ]);
  if (!profile) redirect(`/${locale}${routes.login}`);
  const t = dict.admin;

  return (
    <div className="min-h-[60vh] bg-muted">
      <div className="border-b border-divider bg-white">
        <div className="mx-auto flex max-w-site flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 text-sm sm:px-6">
          <Link href={`/${locale}${routes.admin}`} className="font-extrabold text-brand">
            {t.title}
          </Link>
          <span className="text-muted-foreground">
            {t.signedInAs}{" "}
            <Link
              href={`/${locale}${routes.account}`}
              className="font-semibold text-foreground hover:text-brand hover:underline"
            >
              {profile.full_name || profile.email}
            </Link>
          </span>
          <div className="ml-auto flex items-center gap-5">
            <Link href={`/${locale}`} className="font-semibold text-body hover:text-brand">
              {t.viewSite}
            </Link>
            <form action={signOut.bind(null, locale)}>
              <button type="submit" className="cursor-pointer font-bold text-brand hover:underline">
                {t.signOut}
              </button>
            </form>
          </div>
        </div>
      </div>
      {isStaff(profile) ? (
        children
      ) : (
        <Section>
          <p className="max-w-xl rounded-md bg-white p-6 text-body">{t.noAccess}</p>
        </Section>
      )}
    </div>
  );
}
