import { type NextRequest, NextResponse } from "next/server";
import { defaultLocale, hasLocale } from "@/i18n/config";
import { routes } from "@/lib/site";
import { createSessionClient } from "@/lib/supabase/server";
import { safeNext } from "../next";

/** The email links we send: confirm a new account, or reset a password. */
const EMAIL_TYPES = ["email", "recovery"] as const;
type EmailType = (typeof EMAIL_TYPES)[number];
const isEmailType = (type: string | null): type is EmailType =>
  EMAIL_TYPES.includes(type as EmailType);

/**
 * Google and the links in our emails send the user back here; trade the
 * one-time code for a session. Email templates with `token_hash` work in any
 * browser; a `code` (PKCE) only in the browser that asked for it.
 *
 * After a password reset link: on to choose a new password. New accounts
 * without a birth date go to their account page first to fill in their
 * details.
 */
export async function GET(request: NextRequest, ctx: RouteContext<"/[lang]/inloggen/callback">) {
  const { lang } = await ctx.params;
  const locale = hasLocale(lang) ? lang : defaultLocale;
  const params = request.nextUrl.searchParams;
  const code = params.get("code");
  const tokenHash = params.get("token_hash");
  const type = params.get("type");
  const next = safeNext(params.get("next"));
  const to = (path: string) => NextResponse.redirect(new URL(path, request.url));

  const supabase = await createSessionClient();
  const { data, error } =
    tokenHash && isEmailType(type)
      ? await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
      : code
        ? await supabase.auth.exchangeCodeForSession(code)
        : { data: null, error: true };
  if (error || !data?.user) {
    const failed = type === "recovery" ? "reset" : type === "email" ? "confirm" : "google";
    return to(`/${locale}${routes.login}?error=${failed}`);
  }

  if (type === "recovery") return to(`/${locale}${routes.newPassword}`);

  const { data: profile } = await supabase
    .from("profiles")
    .select("birth_date")
    .eq("id", data.user.id)
    .single();
  if (!profile?.birth_date) {
    const account = `/${locale}${routes.account}`;
    return to(next ? `${account}?next=${encodeURIComponent(next)}` : account);
  }
  return to(next ?? `/${locale}${routes.account}`);
}
