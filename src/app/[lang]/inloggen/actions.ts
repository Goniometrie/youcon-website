"use server";

import { redirect } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { routes } from "@/lib/site";
import { createSessionClient } from "@/lib/supabase/server";

export type SignInState = { error?: boolean; email?: string };

export async function signIn(
  locale: Locale,
  _state: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: true, email };

  // Back to where they came from, but only to a page on this site.
  redirect(/^\/(nl|en)([/?#]|$)/.test(next) ? next : `/${locale}${routes.admin}`);
}

export async function signOut(locale: Locale) {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect(`/${locale}${routes.login}`);
}
