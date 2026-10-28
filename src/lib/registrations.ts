import "server-only";
import type { PostgrestError } from "@supabase/supabase-js";
import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";
import { getCurrentProfile } from "@/lib/auth";
import { createPublicClient, createSessionClient } from "@/lib/supabase/server";

/** Cache tag for registration counts; the sign-up actions update it. */
export const REGISTRATIONS_TAG = "registrations";

export type RegistrationError = "full" | "closed" | "generic";

/**
 * What went wrong with a new registration, or null when it's fine. The
 * database trigger raises `activity_full` and `registration_closed`; a
 * duplicate (23505) means the person is already on the list.
 */
export function registrationError(error: PostgrestError | null): RegistrationError | null {
  if (!error || error.code === "23505") return null;
  if (error.message.includes("activity_full")) return "full";
  if (error.message.includes("registration_closed")) return "closed";
  console.error("registration", error);
  return "generic";
}

/** Number of registrations per published activity id (counts only, no names). */
export async function getRegistrationCounts(): Promise<Record<string, number>> {
  "use cache";
  cacheTag(REGISTRATIONS_TAG);
  cacheLife("hours");

  const { data, error } = await createPublicClient().rpc("registration_counts");
  if (error) throw error;
  return Object.fromEntries(data.map((row) => [row.activity_id, row.count]));
}

/** Ids of the activities the signed-in user signed up for. Reads the session. */
export const getMyRegistrations = cache(async (): Promise<Set<string>> => {
  const profile = await getCurrentProfile();
  if (!profile) return new Set();

  const supabase = await createSessionClient();
  const { data, error } = await supabase
    .from("registrations")
    .select("activity_id")
    .eq("profile_id", profile.id);
  if (error) throw error;
  return new Set(data.map((row) => row.activity_id));
});
