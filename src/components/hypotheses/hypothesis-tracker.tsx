"use client";

import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
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
  const [isFormOpen, setIsFormOpen] = useState(false);

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

  useEffect(() => {
    if (!isFormOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !e.defaultPrevented) setIsFormOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFormOpen]);

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
    <section className="space-y-4" aria-labelledby="tracker-heading">
      <div className="px-4 md:px-8">
        <ImportLocalBanner onImported={() => void loadAll()} />
      </div>

      <header className="flex flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between md:px-8">
        <div>
          <h1
            id="tracker-heading"
            className="text-xl font-semibold tracking-tight text-zinc-100"
          >
            Product Experiment Tracker
          </h1>
          <p className="text-xs text-zinc-500">
            Cadastre e acompanhe hipóteses de experimento.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="flex rounded-lg border border-zinc-700 p-0.5"
            role="tablist"
            aria-label="Modo de visualização"
          >
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "list"}
              className={
                viewMode === "list"
                  ? "rounded-md bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-100 ring-2 ring-zinc-500/45"
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
                  ? "rounded-md bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-100 ring-2 ring-zinc-500/45"
                  : "rounded-md px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-200"
              }
              onClick={() => setViewMode("kanban")}
            >
              Kanban
            </button>
          </div>
          <Button
            type="button"
            variant="emphasis"
            aria-expanded={isFormOpen}
            aria-controls={isFormOpen ? "new-hypothesis-form" : undefined}
            onClick={() => setIsFormOpen((prev) => !prev)}
          >
            <Plus className="size-4" data-icon="inline-start" />
            Nova hipótese
          </Button>
        </div>
      </header>

      {isFormOpen ? (
        <div className="animate-in fade-in-0 slide-in-from-top-2 duration-200 motion-reduce:animate-none px-4 md:px-8">
          <NewHypothesisForm onCreated={handleCreated} />
        </div>
      ) : null}

      <h2 className="sr-only">Suas hipóteses</h2>

      <div
        className={
          viewMode === "list" ? "mx-auto max-w-2xl px-4" : "px-4 md:px-8"
        }
      >
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
            Nenhuma hipótese cadastrada. Use o botão &quot;Nova hipótese&quot;
            acima para começar.
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
