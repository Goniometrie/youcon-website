"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { getCurrentProfile } from "@/lib/auth";
import {
  REGISTRATIONS_TAG,
  registrationError,
  type RegistrationError,
} from "@/lib/registrations";
import { routes } from "@/lib/site";
import { createSessionClient } from "@/lib/supabase/server";

export type RegistrationState = { error?: RegistrationError };

/** Sign the current user up. The database checks that there's room. */
export async function register(
  locale: Locale,
  activityId: string,
  returnTo: string,
): Promise<RegistrationState> {
  const profile = await getCurrentProfile();
  if (!profile) redirect(`/${locale}${routes.login}?next=${encodeURIComponent(returnTo)}`);

  const supabase = await createSessionClient();
  const { error } = await supabase.from("registrations").insert({ activity_id: activityId });
  const problem = registrationError(error);
  if (problem) return { error: problem };

  updateTag(REGISTRATIONS_TAG);
  return {};
}

/** Cancel the current user's registration (until the day itself, per RLS). */
export async function cancelRegistration(activityId: string): Promise<RegistrationState> {
  const profile = await getCurrentProfile();
  if (!profile) return { error: "generic" };

  const supabase = await createSessionClient();
  const { error, count } = await supabase
    .from("registrations")
    .delete({ count: "exact" })
    .eq("activity_id", activityId)
    .eq("profile_id", profile.id);
  if (error || count === 0) {
    if (error) console.error("cancelRegistration", error);
    return { error: count === 0 ? "closed" : "generic" };
  }

  updateTag(REGISTRATIONS_TAG);
  return {};
}
