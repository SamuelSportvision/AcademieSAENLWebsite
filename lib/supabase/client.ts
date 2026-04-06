"use client";

import { createBrowserClient as createBrowser } from "@supabase/ssr";

/** For use in Client Components only. */
export function createBrowserClient() {
  return createBrowser(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
