// Re-export everything from the split modules for convenience.
// Client Components must import from "@/lib/supabase/client".
// Server Components / Route Handlers must import from "@/lib/supabase/server".
export { createBrowserClient } from "./supabase/client";
export { createServerSupabaseClient, createAdminClient } from "./supabase/server";
