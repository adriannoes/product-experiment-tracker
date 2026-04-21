import { getSupabase } from "@/lib/supabase/client";
import {
  hypothesisToInsertRow,
  rowToHypothesis,
  type ExperimentRow,
} from "@/lib/supabase/mappers";
import type {
  CreateHypothesisInput,
  Hypothesis,
  HypothesisStatus,
} from "./types";

// Explicit column list instead of `select *`.
// Prevents silent failures if a future column (e.g. user_id) lacks anon SELECT.
const COLUMNS =
  "id, nome, metrica_sucesso, status, aprendizado, criado_em, atualizado_em";

export async function listHypotheses(): Promise<Hypothesis[]> {
  const { data, error } = await getSupabase()
    .from("experiments")
    .select(COLUMNS)
    .order("criado_em", { ascending: false });

  if (error) {
    console.error("[storage] failed to list hypotheses", error);
    return [];
  }

  return (data as ExperimentRow[]).map(rowToHypothesis);
}

export async function createHypothesis(
  input: CreateHypothesisInput,
): Promise<Hypothesis> {
  const id = crypto.randomUUID();
  const criadoEm = new Date().toISOString();

  const { data, error } = await getSupabase()
    .from("experiments")
    .insert(hypothesisToInsertRow({ ...input, id, criadoEm }))
    .select(COLUMNS)
    .single();

  if (error) throw error;
  return rowToHypothesis(data as ExperimentRow);
}

/**
 * Updates only `status`. `atualizado_em` is set exclusively by the DB trigger.
 * Returns the updated hypothesis (with the trigger-generated timestamp) or null
 * if no row matched the given id.
 */
export async function updateHypothesisStatus(
  id: string,
  status: HypothesisStatus,
): Promise<Hypothesis | null> {
  const { data, error } = await getSupabase()
    .from("experiments")
    .update({ status })
    .eq("id", id)
    .select(COLUMNS)
    .single();

  if (error) {
    // PostgREST returns PGRST116 when `.single()` finds no rows.
    if (error.code === "PGRST116") return null;
    throw error;
  }

  return rowToHypothesis(data as ExperimentRow);
}

export async function removeHypothesis(id: string): Promise<void> {
  const { error } = await getSupabase()
    .from("experiments")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
