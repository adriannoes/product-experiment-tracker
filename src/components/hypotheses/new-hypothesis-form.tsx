"use client";

import { Plus } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createHypothesis } from "@/lib/storage/hypotheses";
import type { Hypothesis } from "@/lib/storage/types";
import {
  HYPOTHESIS_STATUS_ORDER,
  type HypothesisStatus,
} from "@/lib/storage/types";

type NewHypothesisFormProps = {
  // Receives the created hypothesis so the parent can update local state
  // without an extra round-trip (no full refresh needed).
  onCreated: (hypothesis: Hypothesis) => void;
};

export function NewHypothesisForm({ onCreated }: NewHypothesisFormProps) {
  const nomeFieldId = useId();
  const metricFieldId = useId();
  const statusFieldId = useId();
  const validationErrorId = useId();
  const submitErrorId = useId();
  const nomeInputRef = useRef<HTMLInputElement>(null);

  const [nome, setNome] = useState("");
  const [metricaSucesso, setMetricaSucesso] = useState("");
  const [status, setStatus] = useState<HypothesisStatus>("Backlog");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    nomeInputRef.current?.focus();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedNome = nome.trim();
    const trimmedMetrica = metricaSucesso.trim();

    if (trimmedNome.length === 0 || trimmedMetrica.length === 0) {
      setValidationError("Preencha nome e métrica de sucesso.");
      return;
    }

    setValidationError(null);
    setSubmitError(null);
    setIsSaving(true);

    try {
      const created = await createHypothesis({
        nome: trimmedNome,
        metricaSucesso: trimmedMetrica,
        status,
      });
      // Reset form fields only after a confirmed successful save.
      setNome("");
      setMetricaSucesso("");
      setStatus("Backlog");
      nomeInputRef.current?.focus();
      onCreated(created);
    } catch {
      setSubmitError("Erro ao salvar. Verifique sua conexão e tente novamente.");
    } finally {
      setIsSaving(false);
    }
  }

  const errorDescribedBy = [
    validationError ? validationErrorId : null,
    submitError ? submitErrorId : null,
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => void handleSubmit(e)}
      noValidate
      aria-describedby={errorDescribedBy}
    >
      <div className="grid gap-4 sm:grid-cols-1">
        <div className="space-y-1.5">
          <Label htmlFor={nomeFieldId}>Nome</Label>
          <Input
            ref={nomeInputRef}
            id={nomeFieldId}
            name="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            autoComplete="off"
            aria-invalid={validationError ? true : undefined}
            disabled={isSaving}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={metricFieldId}>Métrica de sucesso</Label>
          <Input
            id={metricFieldId}
            name="metricaSucesso"
            value={metricaSucesso}
            onChange={(e) => setMetricaSucesso(e.target.value)}
            required
            autoComplete="off"
            aria-invalid={validationError ? true : undefined}
            disabled={isSaving}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={statusFieldId}>Status</Label>
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as HypothesisStatus)}
            disabled={isSaving}
          >
            <SelectTrigger id={statusFieldId} className="w-full min-w-0">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {HYPOTHESIS_STATUS_ORDER.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {validationError ? (
        <p
          id={validationErrorId}
          className="text-sm text-red-400"
          role="alert"
        >
          {validationError}
        </p>
      ) : null}

      {submitError ? (
        <p
          id={submitErrorId}
          className="text-sm text-red-400"
          role="alert"
        >
          {submitError}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={isSaving}
        className="bg-lime-400 text-zinc-950 shadow-[0_0_18px_-2px_rgba(163,230,53,0.65)] hover:bg-lime-300 hover:shadow-[0_0_24px_-2px_rgba(163,230,53,0.9)] focus-visible:ring-lime-400/60 disabled:opacity-50"
      >
        <Plus className="size-4" />
        {isSaving ? "Salvando…" : "Adicionar hipótese"}
      </Button>
    </form>
  );
}
