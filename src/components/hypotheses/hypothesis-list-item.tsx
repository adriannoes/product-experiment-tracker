"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Hypothesis } from "@/lib/storage/types";

import { StatusText } from "./status-text";

type HypothesisListItemProps = {
  item: Hypothesis;
  onDelete: () => void;
};

export function HypothesisListItem({ item, onDelete }: HypothesisListItemProps) {
  return (
    <li className="flex items-start justify-between gap-4 rounded-md border border-zinc-800 p-4">
      <div className="min-w-0 flex-1 space-y-1">
        <h3 className="text-base font-medium leading-snug text-zinc-100">
          {item.nome}
        </h3>
        <StatusText status={item.status} />
        <p className="text-sm text-zinc-400">{item.metricaSucesso}</p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="shrink-0"
        aria-label={`Excluir hipótese ${item.nome}`}
        onClick={onDelete}
      >
        <Trash2 className="size-4" />
      </Button>
    </li>
  );
}
