import "server-only";
import { cache } from "react";
import { createSessionClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export type Profile = Pick<
  Tables<"profiles">,
  | "id"
  | "email"
  | "first_name"
  | "last_name"
  | "full_name"
  | "company"
  | "birth_date"
  | "role"
  | "created_at"
>;

/** The signed-in user's profile, or null. Reads the request (cookies). */
export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  const supabase = await createSessionClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims.sub;
  if (!userId) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, first_name, last_name, full_name, company, birth_date, role, created_at")
    .eq("id", userId)
    .single();
  return profile;
});

export const isStaff = (profile: Profile | null) =>
  profile?.role === "board" || profile?.role === "admin";

/**
 * For Server Actions: the signed-in board member or admin. Throws otherwise,
 * so an action never runs on a page that only hid its button.
 */
export async function requireStaff(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile || !isStaff(profile)) throw new Error("Not authorized");
  return profile;
}

/** How the signed-in user can sign in: "email" (password), "google", … */
export const getSignInProviders = cache(async (): Promise<string[]> => {
  const supabase = await createSessionClient();
  const { data } = await supabase.auth.getClaims();
  return data?.claims.app_metadata?.providers ?? [];
});
