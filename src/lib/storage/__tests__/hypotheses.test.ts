import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ExperimentRow } from "@/lib/supabase/mappers";
import {
  createHypothesis,
  listHypotheses,
  removeHypothesis,
  updateHypothesisStatus,
} from "../hypotheses";

// ---------------------------------------------------------------------------
// Supabase client mock
// ---------------------------------------------------------------------------
// vi.mock factories are hoisted to the top of the file by vitest, which means
// any variables referenced inside the factory must also be hoisted via
// vi.hoisted() — otherwise the reference is initialised AFTER the hoist.
// ---------------------------------------------------------------------------

const { mockSingle, mockOrderResult } = vi.hoisted(() => ({
  mockSingle: vi.fn(),
  mockOrderResult: vi.fn(),
}));

vi.mock("@/lib/supabase/client", () => ({
  getSupabase: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: mockOrderResult,
        single: mockSingle,
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: mockSingle,
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: mockSingle,
          })),
        })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(async () => mockSingle()),
      })),
    })),
  })),
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRow(overrides: Partial<ExperimentRow> = {}): ExperimentRow {
  return {
    id: "abc-123",
    nome: "Testar CTA",
    metrica_sucesso: "CTR > 5%",
    status: "Backlog",
    aprendizado: null,
    criado_em: "2026-01-01T10:00:00.000Z",
    atualizado_em: "2026-01-01T10:00:00.000Z",
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// listHypotheses
// ---------------------------------------------------------------------------

describe("listHypotheses", () => {
  it("returns an empty array when the DB returns no rows", async () => {
    mockOrderResult.mockResolvedValueOnce({ data: [], error: null });
    expect(await listHypotheses()).toEqual([]);
  });

  it("maps rows to Hypothesis objects and preserves order from DB", async () => {
    const rows: ExperimentRow[] = [
      makeRow({ id: "newer", criado_em: "2026-06-01T10:00:00.000Z", atualizado_em: "2026-06-01T10:00:00.000Z" }),
      makeRow({ id: "older", criado_em: "2026-01-01T10:00:00.000Z", atualizado_em: "2026-01-01T10:00:00.000Z" }),
    ];
    mockOrderResult.mockResolvedValueOnce({ data: rows, error: null });
    const result = await listHypotheses();
    expect(result.map((h) => h.id)).toEqual(["newer", "older"]);
  });

  it("returns an empty array and logs on Supabase error", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockOrderResult.mockResolvedValueOnce({
      data: null,
      error: { message: "network error", code: "500" },
    });
    expect(await listHypotheses()).toEqual([]);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// createHypothesis
// ---------------------------------------------------------------------------

describe("createHypothesis", () => {
  it("returns a Hypothesis with id and timestamps from DB response", async () => {
    const row = makeRow({ id: "new-uuid", atualizado_em: "2026-04-20T12:00:00.000Z" });
    mockSingle.mockResolvedValueOnce({ data: row, error: null });

    const result = await createHypothesis({
      nome: "Testar CTA",
      metricaSucesso: "CTR > 5%",
      status: "Backlog",
    });

    expect(result.id).toBe("new-uuid");
    expect(result.nome).toBe("Testar CTA");
    expect(result.metricaSucesso).toBe("CTR > 5%");
    expect(result.status).toBe("Backlog");
    expect(result.atualizadoEm).toBe("2026-04-20T12:00:00.000Z");
  });

  it("throws when Supabase returns an error", async () => {
    mockSingle.mockResolvedValueOnce({
      data: null,
      error: { message: "insert failed", code: "42501" },
    });
    await expect(
      createHypothesis({ nome: "X", metricaSucesso: "Y", status: "Backlog" }),
    ).rejects.toMatchObject({ message: "insert failed" });
  });
});

// ---------------------------------------------------------------------------
// updateHypothesisStatus
// ---------------------------------------------------------------------------

describe("updateHypothesisStatus", () => {
  it("returns updated Hypothesis with DB-generated atualizado_em", async () => {
    const updated = makeRow({
      status: "Em andamento",
      atualizado_em: "2026-04-20T13:00:00.000Z",
    });
    mockSingle.mockResolvedValueOnce({ data: updated, error: null });

    const result = await updateHypothesisStatus("abc-123", "Em andamento");
    expect(result).not.toBeNull();
    expect(result?.status).toBe("Em andamento");
    expect(result?.atualizadoEm).toBe("2026-04-20T13:00:00.000Z");
  });

  it("returns null when the row is not found (PGRST116)", async () => {
    mockSingle.mockResolvedValueOnce({
      data: null,
      error: { code: "PGRST116", message: "no rows" },
    });
    expect(await updateHypothesisStatus("unknown-id", "Backlog")).toBeNull();
  });

  it("throws on unexpected Supabase errors", async () => {
    mockSingle.mockResolvedValueOnce({
      data: null,
      error: { code: "42501", message: "permission denied" },
    });
    await expect(
      updateHypothesisStatus("abc-123", "Em andamento"),
    ).rejects.toMatchObject({ message: "permission denied" });
  });
});

// ---------------------------------------------------------------------------
// removeHypothesis
// ---------------------------------------------------------------------------

describe("removeHypothesis", () => {
  it("resolves without throwing on success", async () => {
    mockSingle.mockResolvedValueOnce({ error: null });
    await expect(removeHypothesis("abc-123")).resolves.toBeUndefined();
  });

  it("throws when Supabase returns an error", async () => {
    mockSingle.mockResolvedValueOnce({
      error: { code: "42501", message: "delete denied" },
    });
    await expect(removeHypothesis("abc-123")).rejects.toMatchObject({
      message: "delete denied",
    });
  });
});
