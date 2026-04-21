"use client";

import { useCallback, useEffect, useState } from "react";

import { getSupabase } from "@/lib/supabase/client";
import {
  listHypotheses,
  removeHypothesis,
  updateHypothesisStatus,
} from "@/lib/storage/hypotheses";
import type { Hypothesis, HypothesisStatus } from "@/lib/storage/types";

import { HypothesisKanban } from "./hypothesis-kanban";
import { HypothesisListItem } from "./hypothesis-list-item";
import { ImportLocalBanner } from "./import-local-banner";
import { NewHypothesisForm } from "./new-hypothesis-form";

type ViewMode = "list" | "kanban";

export function HypothesisTracker() {
  const [items, setItems] = useState<Hypothesis[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  // Three distinct states: loading prevents flash of empty-state CTA.
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadAll = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const data = await listHypotheses();
      setItems(data);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load. `loadAll` is async — state updates happen inside the
  // resolved promise, not synchronously in the effect body.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadAll();
  }, [loadAll]);

  // Realtime: any change in the `experiments` table triggers a full reload.
  // This makes the "two browsers" demo work without a manual refresh.
  useEffect(() => {
    const client = getSupabase();
    const channel = client
      .channel("experiments-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "experiments" },
        () => {
          void loadAll();
        },
      )
      .subscribe();

    return () => {
      void client.removeChannel(channel);
    };
  }, [loadAll]);

  // Optimistic: prepend the newly created item without waiting for a reload.
  const handleCreated = useCallback((created: Hypothesis) => {
    setItems((prev) => [created, ...prev]);
  }, []);

  const handleDelete = useCallback(
    async (id: string, nome: string) => {
      if (
        !window.confirm(
          `Excluir a hipótese "${nome}"? Essa ação não pode ser desfeita.`,
        )
      ) {
        return;
      }
      try {
        await removeHypothesis(id);
        setItems((prev) => prev.filter((h) => h.id !== id));
      } catch {
        alert("Erro ao excluir. Verifique sua conexão e tente novamente.");
      }
    },
    [],
  );

  const handleStatusChange = useCallback(
    async (id: string, status: HypothesisStatus) => {
      try {
        const updated = await updateHypothesisStatus(id, status);
        if (updated) {
          setItems((prev) => prev.map((h) => (h.id === id ? updated : h)));
        }
      } catch {
        alert("Erro ao atualizar status. Verifique sua conexão.");
      }
    },
    [],
  );

  return (
    <section className="space-y-6" aria-labelledby="hypotheses-heading">
      <ImportLocalBanner onImported={() => void loadAll()} />
      <NewHypothesisForm onCreated={handleCreated} />
      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2
            id="hypotheses-heading"
            className="text-sm font-medium text-zinc-300"
          >
            Suas hipóteses
          </h2>
          <div
            className="flex rounded-lg border border-zinc-800 p-0.5"
            role="tablist"
            aria-label="Modo de visualização"
          >
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "list"}
              className={
                viewMode === "list"
                  ? "rounded-md bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-100"
                  : "rounded-md px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-200"
              }
              onClick={() => setViewMode("list")}
            >
              Lista
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "kanban"}
              className={
                viewMode === "kanban"
                  ? "rounded-md bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-100"
                  : "rounded-md px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-200"
              }
              onClick={() => setViewMode("kanban")}
            >
              Kanban
            </button>
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-zinc-500">Carregando hipóteses…</p>
        ) : hasError ? (
          <div className="space-y-2">
            <p className="text-sm text-red-400">
              Não foi possível carregar as hipóteses. Verifique sua conexão.
            </p>
            <button
              type="button"
              className="text-sm text-zinc-400 underline hover:text-zinc-200"
              onClick={() => void loadAll()}
            >
              Tentar novamente
            </button>
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-zinc-500">
            Cadastre sua primeira hipótese no formulário acima.
          </p>
        ) : viewMode === "list" ? (
          <ul className="list-none space-y-3 p-0">
            {items.map((item) => (
              <HypothesisListItem
                key={item.id}
                item={item}
                onDelete={() => void handleDelete(item.id, item.nome)}
              />
            ))}
          </ul>
        ) : (
          <HypothesisKanban
            items={items}
            onStatusChange={(id, status) => void handleStatusChange(id, status)}
            onDelete={(id, nome) => void handleDelete(id, nome)}
          />
        )}
      </div>
    </section>
  );
}
