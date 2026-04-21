import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

/**
 * Lazy singleton — defers `createClient` until first call so the module can be
 * imported at build time without crashing when env vars are not yet available.
 * All callers run inside useEffect / event handlers (client-side only).
 */
export function getSupabase(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error(
        "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
          "Set them in .env.local (dev) or Vercel Environment Variables (prod).",
      );
    }
    _client = createClient(url, key);
  }
  return _client;
}
