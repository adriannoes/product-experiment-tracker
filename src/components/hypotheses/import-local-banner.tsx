"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  hasLocalHypotheses,
  importLocalHypothesesToSupabase,
} from "@/lib/supabase/import-local";

type Props = {
  onImported: () => void;
};

export function ImportLocalBanner({ onImported }: Props) {
  // Must start as false to match the server render (localStorage is unavailable
  // during SSR). The real value is read after hydration in the effect below.
  const [visible, setVisible] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reading localStorage only runs client-side, after hydration completes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(hasLocalHypotheses());
  }, []);

  if (!visible) return null;

  async function handleImport() {
    setIsImporting(true);
    setError(null);
    try {
      const count = await importLocalHypothesesToSupabase();
      setVisible(false);
      onImported();
      if (count > 0) {
        // Clear local data so the banner doesn't reappear.
        localStorage.removeItem("pet:hypotheses:v1");
      }
    } catch {
      setError("Erro ao importar. Verifique sua conexão e tente novamente.");
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <div className="rounded-md border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm">
      <p className="text-zinc-300">
        Você tem hipóteses salvas localmente neste navegador. Deseja importá-las
        para o banco de dados?
      </p>
      {error ? (
        <p className="mt-1 text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      <div className="mt-3 flex gap-3">
        <Button
          type="button"
          size="sm"
          disabled={isImporting}
          onClick={() => void handleImport()}
          className="bg-zinc-700 text-zinc-100 hover:bg-zinc-600"
        >
          {isImporting ? "Importando…" : "Importar dados locais"}
        </Button>
        <button
          type="button"
          className="text-sm text-zinc-500 hover:text-zinc-300"
          onClick={() => setVisible(false)}
        >
          Ignorar
        </button>
      </div>
    </div>
  );
}
