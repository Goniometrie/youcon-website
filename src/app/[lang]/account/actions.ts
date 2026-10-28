"use server";

import { refresh } from "next/cache";
import { getCurrentProfile } from "@/lib/auth";
import { createSessionClient } from "@/lib/supabase/server";
import { MIN_PASSWORD_LENGTH } from "./password";

type Name = { first_name: string; last_name: string };
export type NameState = { saved?: boolean; failed?: boolean; values?: Name };

export async function updateName(_state: NameState, formData: FormData): Promise<NameState> {
  const values: Name = {
    first_name: String(formData.get("first_name") ?? "").trim(),
    last_name: String(formData.get("last_name") ?? "").trim(),
  };
  const profile = await getCurrentProfile();
  if (!profile) return { failed: true, values };

  const supabase = await createSessionClient();
  // RLS skips rows it doesn't allow instead of erroring, so check that the
  // row came back.
  const { data, error } = await supabase
    .from("profiles")
    .update({ first_name: values.first_name || null, last_name: values.last_name || null })
    .eq("id", profile.id)
    .select("id");
  if (error || !data?.length) return { failed: true, values };

  refresh();
  return { saved: true, values };
}

export type PasswordError = "current" | "short" | "mismatch" | "same" | "failed";
export type PasswordState = { saved?: boolean; error?: PasswordError };

export async function updatePassword(
  _state: PasswordState,
  formData: FormData,
): Promise<PasswordState> {
  const current = String(formData.get("current_password") ?? "");
  const next = String(formData.get("new_password") ?? "");
  const confirm = String(formData.get("confirm_password") ?? "");

  if (next.length < MIN_PASSWORD_LENGTH) return { error: "short" };
  if (next !== confirm) return { error: "mismatch" };

  const profile = await getCurrentProfile();
  if (!profile) return { error: "failed" };

  // Ask for the current password, so an unattended session can't be used to
  // take over the account.
  const supabase = await createSessionClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: profile.email,
    password: current,
  });
  if (signInError) return { error: "current" };

  const { error } = await supabase.auth.updateUser({ password: next });
  if (error) return { error: error.code === "same_password" ? "same" : "failed" };

  return { saved: true };
}
