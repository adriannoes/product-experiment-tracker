import type { CreateHypothesisInput, Hypothesis, HypothesisStatus } from "@/lib/storage/types";

/**
 * Shape of a row returned by the `experiments` table in Supabase.
 * Column names use snake_case (Postgres convention).
 */
export type ExperimentRow = {
  id: string;
  nome: string;
  metrica_sucesso: string;
  status: HypothesisStatus;
  aprendizado: string | null;
  criado_em: string;
  atualizado_em: string;
};

/**
 * Converts a raw Supabase `experiments` row to the app's `Hypothesis` type.
 * Pure function — no side effects, no network, safe to unit-test with static data.
 */
export function rowToHypothesis(row: ExperimentRow): Hypothesis {
  return {
    id: row.id,
    nome: row.nome,
    metricaSucesso: row.metrica_sucesso,
    status: row.status,
    aprendizado: row.aprendizado ?? undefined,
    criadoEm: row.criado_em,
    atualizadoEm: row.atualizado_em,
  };
}

/**
 * Converts a `CreateHypothesisInput` (plus generated id and criadoEm) into
 * the row shape expected by Supabase INSERT.
 * `atualizado_em` is omitted — the DB trigger sets it on every write.
 */
export function hypothesisToInsertRow(
  input: CreateHypothesisInput & { id: string; criadoEm: string },
): Omit<ExperimentRow, "atualizado_em"> {
  return {
    id: input.id,
    nome: input.nome,
    metrica_sucesso: input.metricaSucesso,
    status: input.status,
    aprendizado: null,
    criado_em: input.criadoEm,
  };
}

/**
 * Converts a full `Hypothesis` object into the row shape expected by Supabase
 * UPSERT (used by the localStorage import utility).
 * `atualizado_em` is omitted for the same reason as above.
 */
export function hypothesisToUpsertRow(
  h: Hypothesis,
): Omit<ExperimentRow, "atualizado_em"> {
  return {
    id: h.id,
    nome: h.nome,
    metrica_sucesso: h.metricaSucesso,
    status: h.status,
    aprendizado: h.aprendizado ?? null,
    criado_em: h.criadoEm,
  };
}
