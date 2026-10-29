"use server";

import { redirect } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { getCurrentProfile } from "@/lib/auth";
import { MIN_PASSWORD_LENGTH } from "@/lib/password";
import { routes } from "@/lib/site";
import { createSessionClient } from "@/lib/supabase/server";
import { callbackUrl } from "./callback/url";
import { safeNext } from "./next";

export type SignInState = { error?: "invalid" | "unconfirmed"; email?: string };

export async function signIn(
  locale: Locale,
  _state: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));

  const supabase = await createSessionClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: error.code === "email_not_confirmed" ? "unconfirmed" : "invalid", email };
  }

  // Back to where they came from, but only to a page on this site. Otherwise
  // the board to the admin, members to their account.
  if (next) redirect(next);
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();
  const staff = profile?.role === "board" || profile?.role === "admin";
  redirect(`/${locale}${staff ? routes.admin : routes.account}`);
}

/**
 * Off to Google. Signs in an existing account, or creates one (role member)
 * for a new address. Google sends the user back to the callback route.
 */
export async function signInWithGoogle(locale: Locale, formData: FormData) {
  const next = safeNext(formData.get("next"));

  const supabase = await createSessionClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: await callbackUrl(locale, next) },
  });
  if (error) redirect(`/${locale}${routes.login}?error=google`);

  redirect(data.url);
}

export async function signOut(locale: Locale) {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect(`/${locale}${routes.login}`);
}

export type ResetRequestState = { sentTo?: string; error?: "rateLimit" | "failed"; email?: string };

/**
 * Emails a link to set a new password. Says it was sent either way, so the
 * form doesn't tell which addresses have an account.
 */
export async function requestPasswordReset(
  locale: Locale,
  _state: ResetRequestState,
  formData: FormData,
): Promise<ResetRequestState> {
  const email = String(formData.get("email") ?? "").trim();

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: await callbackUrl(locale, undefined, "recovery"),
  });
  if (error) return { error: error.code?.startsWith("over_") ? "rateLimit" : "failed", email };

  return { sentTo: email };
}

export type NewPasswordError = "short" | "mismatch" | "same" | "expired" | "failed";
export type NewPasswordState = { saved?: boolean; error?: NewPasswordError };

/** Sets the password after following the link from the reset email. */
export async function setNewPassword(
  _state: NewPasswordState,
  formData: FormData,
): Promise<NewPasswordState> {
  const password = String(formData.get("new_password") ?? "");
  const confirm = String(formData.get("confirm_password") ?? "");

  if (password.length < MIN_PASSWORD_LENGTH) return { error: "short" };
  if (password !== confirm) return { error: "mismatch" };

  // The link signed them in; without that session the link has run out.
  if (!(await getCurrentProfile())) return { error: "expired" };

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.code === "same_password" ? "same" : "failed" };

  return { saved: true };
}
