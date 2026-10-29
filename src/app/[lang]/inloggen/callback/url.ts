import "server-only";
import { headers } from "next/headers";
import type { Locale } from "@/i18n/config";
import { routes } from "@/lib/site";

/**
 * The callback route on this site, which Google and the links in our emails
 * send the user back to. `type` tells it which email link it was.
 */
export async function callbackUrl(locale: Locale, next?: string, type?: "email" | "recovery") {
  const url = new URL(`/${locale}${routes.login}/callback`, (await headers()).get("origin")!);
  if (type) url.searchParams.set("type", type);
  if (next) url.searchParams.set("next", next);
  return url.href;
}
