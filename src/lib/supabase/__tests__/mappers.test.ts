import { describe, expect, it } from "vitest";

import type { Hypothesis } from "@/lib/storage/types";
import {
  hypothesisToInsertRow,
  hypothesisToUpsertRow,
  rowToHypothesis,
  type ExperimentRow,
} from "../mappers";

const baseRow: ExperimentRow = {
  id: "abc-123",
  nome: "Testar CTA verde",
  metrica_sucesso: "CTR > 5%",
  status: "Backlog",
  aprendizado: null,
  criado_em: "2026-04-20T10:00:00.000Z",
  atualizado_em: "2026-04-20T10:00:00.000Z",
};

const baseHypothesis: Hypothesis = {
  id: "abc-123",
  nome: "Testar CTA verde",
  metricaSucesso: "CTR > 5%",
  status: "Backlog",
  aprendizado: undefined,
  criadoEm: "2026-04-20T10:00:00.000Z",
  atualizadoEm: "2026-04-20T10:00:00.000Z",
};

describe("rowToHypothesis", () => {
  it("maps all snake_case fields to camelCase correctly", () => {
    expect(rowToHypothesis(baseRow)).toEqual(baseHypothesis);
  });

  it("maps a non-null aprendizado value", () => {
    const row: ExperimentRow = { ...baseRow, aprendizado: "Aprendizado teste" };
    expect(rowToHypothesis(row).aprendizado).toBe("Aprendizado teste");
  });

  it("converts null aprendizado to undefined", () => {
    expect(rowToHypothesis(baseRow).aprendizado).toBeUndefined();
  });

  it("preserves all four valid status values", () => {
    const statuses = [
      "Backlog",
      "Em andamento",
      "Concluído — Validada",
      "Concluído — Invalidada",
    ] as const;

    for (const status of statuses) {
      const row: ExperimentRow = { ...baseRow, status };
      expect(rowToHypothesis(row).status).toBe(status);
    }
  });

  it("preserves ISO 8601 timestamps as-is", () => {
    const result = rowToHypothesis(baseRow);
    expect(result.criadoEm).toBe(baseRow.criado_em);
    expect(result.atualizadoEm).toBe(baseRow.atualizado_em);
  });
});

describe("hypothesisToInsertRow", () => {
  it("maps camelCase fields to snake_case correctly", () => {
    const input = {
      nome: "Testar CTA verde",
      metricaSucesso: "CTR > 5%",
      status: "Backlog" as const,
      id: "abc-123",
      criadoEm: "2026-04-20T10:00:00.000Z",
    };
    const row = hypothesisToInsertRow(input);

    expect(row.id).toBe("abc-123");
    expect(row.nome).toBe("Testar CTA verde");
    expect(row.metrica_sucesso).toBe("CTR > 5%");
    expect(row.status).toBe("Backlog");
    expect(row.aprendizado).toBeNull();
    expect(row.criado_em).toBe("2026-04-20T10:00:00.000Z");
    // atualizado_em must NOT be present (managed by DB trigger)
    expect("atualizado_em" in row).toBe(false);
  });
});

describe("hypothesisToUpsertRow", () => {
  it("maps a full Hypothesis object to a row without atualizado_em", () => {
    const row = hypothesisToUpsertRow(baseHypothesis);

    expect(row.id).toBe(baseHypothesis.id);
    expect(row.nome).toBe(baseHypothesis.nome);
    expect(row.metrica_sucesso).toBe(baseHypothesis.metricaSucesso);
    expect(row.status).toBe(baseHypothesis.status);
    expect(row.aprendizado).toBeNull();
    expect(row.criado_em).toBe(baseHypothesis.criadoEm);
    expect("atualizado_em" in row).toBe(false);
  });

  it("converts defined aprendizado to string (not null)", () => {
    const h: Hypothesis = { ...baseHypothesis, aprendizado: "Aprendi algo" };
    expect(hypothesisToUpsertRow(h).aprendizado).toBe("Aprendi algo");
  });

  it("converts undefined aprendizado to null", () => {
    const h: Hypothesis = { ...baseHypothesis, aprendizado: undefined };
    expect(hypothesisToUpsertRow(h).aprendizado).toBeNull();
  });
});
