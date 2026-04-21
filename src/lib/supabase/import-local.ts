import { getSupabase } from "@/lib/supabase/client";
import { hypothesisToUpsertRow } from "@/lib/supabase/mappers";
import type { Hypothesis } from "@/lib/storage/types";

const LOCAL_STORAGE_KEY = "pet:hypotheses:v1";

/**
 * Reads hypotheses from the legacy localStorage key and upserts them into
 * Supabase. Safe to run multiple times — upsert on `id` prevents duplicates.
 *
 * This function uses a separate path from `createHypothesis` because:
 *   - It sends the original client-generated UUIDs (preserving identity).
 *   - It sends `criado_em` as stored in localStorage (preserving history).
 *   - `atualizado_em` is still managed by the DB trigger.
 *
 * Returns the number of items imported, or 0 if there was nothing to import.
 * Throws on Supabase errors so the caller can surface them to the user.
 */
export async function importLocalHypothesesToSupabase(): Promise<number> {
  if (typeof window === "undefined") return 0;

  const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!raw) return 0;

  let items: Hypothesis[];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return 0;
    items = parsed as Hypothesis[];
  } catch {
    console.error("[import] failed to parse localStorage data");
    return 0;
  }

  if (items.length === 0) return 0;

  const { error } = await getSupabase()
    .from("experiments")
    .upsert(items.map(hypothesisToUpsertRow), { onConflict: "id" });

  if (error) throw error;
  return items.length;
}

/**
 * Returns true if there are hypothesis records in localStorage to import.
 * Used to decide whether to show the import button.
 */
export function hasLocalHypotheses(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return false;
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0;
  } catch {
    return false;
  }
}
