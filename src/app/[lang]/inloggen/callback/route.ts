import { type NextRequest, NextResponse } from "next/server";
import { defaultLocale, hasLocale } from "@/i18n/config";
import { routes } from "@/lib/site";
import { createSessionClient } from "@/lib/supabase/server";
import { safeNext } from "../next";

/**
 * Google sends the user back here with a one-time code; trade it for a
 * session. New accounts without a birth date go to their account page first
 * to fill in their details.
 */
export async function GET(request: NextRequest, ctx: RouteContext<"/[lang]/inloggen/callback">) {
  const { lang } = await ctx.params;
  const locale = hasLocale(lang) ? lang : defaultLocale;
  const code = request.nextUrl.searchParams.get("code");
  const next = safeNext(request.nextUrl.searchParams.get("next"));
  const to = (path: string) => NextResponse.redirect(new URL(path, request.url));

  const supabase = await createSessionClient();
  const { data, error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : { data: null, error: true };
  if (error || !data?.user) return to(`/${locale}${routes.login}?error=google`);

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
