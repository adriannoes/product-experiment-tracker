/**
 * Status values for a hypothesis (PRD section 4.1).
 */
export type HypothesisStatus =
  | "Backlog"
  | "Em andamento"
  | "Concluído — Validada"
  | "Concluído — Invalidada";

/** Column / form order for all status values. */
export const HYPOTHESIS_STATUS_ORDER: readonly HypothesisStatus[] = [
  "Backlog",
  "Em andamento",
  "Concluído — Validada",
  "Concluído — Invalidada",
] as const;

/**
 * A stored hypothesis. Timestamps are ISO 8601 strings.
 * `aprendizado` is optional: the DB column exists (PRD v1.1), but the UI
 * does not expose it yet. Typed here to keep the TS contract aligned with
 * the database schema and avoid silent mismatches on reads.
 */
export type Hypothesis = {
  id: string;
  nome: string;
  metricaSucesso: string;
  status: HypothesisStatus;
  aprendizado?: string | null;
  criadoEm: string;
  atualizadoEm: string;
};

export type CreateHypothesisInput = Pick<
  Hypothesis,
  "nome" | "metricaSucesso" | "status"
>;
