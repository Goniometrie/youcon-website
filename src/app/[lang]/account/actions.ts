"use server";

import { refresh } from "next/cache";
import { getCurrentProfile } from "@/lib/auth";
import { MIN_PASSWORD_LENGTH } from "@/lib/password";
import { isValidBirthDate } from "@/lib/profile";
import { createSessionClient } from "@/lib/supabase/server";

type ProfileValues = {
  first_name: string;
  last_name: string;
  company: string;
  birth_date: string;
};
export type ProfileState = {
  saved?: boolean;
  failed?: boolean;
  invalidBirthDate?: boolean;
  values?: ProfileValues;
};

export async function updateProfile(
  _state: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const field = (name: keyof ProfileValues) => String(formData.get(name) ?? "").trim();
  const values: ProfileValues = {
    first_name: field("first_name"),
    last_name: field("last_name"),
    company: field("company"),
    birth_date: field("birth_date"),
  };
  if (!isValidBirthDate(values.birth_date)) return { invalidBirthDate: true, values };

  const profile = await getCurrentProfile();
  if (!profile) return { failed: true, values };

  const supabase = await createSessionClient();
  // RLS skips rows it doesn't allow instead of erroring, so check that the
  // row came back.
  const { data, error } = await supabase
    .from("profiles")
    .update({
      first_name: values.first_name || null,
      last_name: values.last_name || null,
      company: values.company || null,
      birth_date: values.birth_date,
    })
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
