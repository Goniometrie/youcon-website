import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

/** Client in the browser, signed in through the same session cookies. */
export function createBrowserSupabase() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
