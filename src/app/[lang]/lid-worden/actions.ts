"use server";

import { redirect } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { MIN_PASSWORD_LENGTH } from "@/lib/password";
import { isValidBirthDate } from "@/lib/profile";
import { routes } from "@/lib/site";
import { createSessionClient } from "@/lib/supabase/server";
import { callbackUrl } from "../inloggen/callback/url";
import { safeNext } from "../inloggen/next";

type SignUpValues = {
  first_name: string;
  last_name: string;
  company: string;
  birth_date: string;
  email: string;
};
export type SignUpError =
  | "birthDate"
  | "short"
  | "mismatch"
  | "weak"
  | "email"
  | "exists"
  | "rateLimit"
  | "failed";
export type SignUpState = { error?: SignUpError; values?: SignUpValues; sentTo?: string };

/**
 * A new member account with email and password. Supabase emails a link to
 * confirm the address; the profile (role member) is filled from the details
 * given here, by the trigger `private.handle_new_user`.
 */
export async function signUp(
  locale: Locale,
  _state: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const field = (name: keyof SignUpValues) => String(formData.get(name) ?? "").trim();
  const values: SignUpValues = {
    first_name: field("first_name"),
    last_name: field("last_name"),
    company: field("company"),
    birth_date: field("birth_date"),
    email: field("email"),
  };
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm_password") ?? "");
  const next = safeNext(formData.get("next"));

  if (!isValidBirthDate(values.birth_date)) return { error: "birthDate", values };
  if (password.length < MIN_PASSWORD_LENGTH) return { error: "short", values };
  if (password !== confirm) return { error: "mismatch", values };

  const supabase = await createSessionClient();
  const { email, ...details } = values;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: await callbackUrl(locale, next, "email"),
      data: details,
    },
  });
  if (error) {
    const code = error.code ?? "";
    const known: Record<string, SignUpError> = {
      weak_password: "weak",
      email_address_invalid: "email",
      user_already_exists: "exists",
    };
    return { error: known[code] ?? (code.startsWith("over_") ? "rateLimit" : "failed"), values };
  }

  // With email confirmation off, Supabase signs the new member in right away.
  if (data.session) redirect(next ?? `/${locale}${routes.account}`);

  // Also when the address already has an account: Supabase then sends no
  // email, but says nothing either, so the form doesn't give it away.
  return { sentTo: email };
}
