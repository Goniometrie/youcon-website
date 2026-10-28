import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale, locales } from "@/i18n/config";
import { routes } from "@/lib/site";
import { updateSession } from "@/lib/supabase/proxy";

/** Pick the first supported language from Accept-Language, else the default. */
function preferredLocale(request: NextRequest) {
  const header = request.headers.get("accept-language") ?? "";
  for (const part of header.split(",")) {
    const base = part.split(";")[0].trim().toLowerCase().split("-")[0];
    if (hasLocale(base)) return base;
  }
  return defaultLocale;
}

// Pages that use the Supabase session: admin and login.
const SESSION_PATH = new RegExp(`^/(${locales.join("|")})(${routes.admin}|${routes.login})(/|$)`);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = SESSION_PATH.exec(pathname);
  if (session) {
    const { response, signedIn } = await updateSession(request);
    if (!signedIn && session[2] === routes.admin) {
      // Not signed in: straight to the login page. The admin layout checks
      // the role as well, so this is a shortcut, not the protection.
      request.nextUrl.pathname = `/${session[1]}${routes.login}`;
      return NextResponse.redirect(request.nextUrl);
    }
    return response;
  }

  const hasPrefix = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasPrefix) return;

  request.nextUrl.pathname = `/${preferredLocale(request)}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Skip Next.js internals, API routes and files with an extension.
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
