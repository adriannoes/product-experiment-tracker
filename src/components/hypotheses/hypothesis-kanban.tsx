"use client";

import { Trash2 } from "lucide-react";
import { useId } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HYPOTHESIS_STATUS_ORDER,
  type Hypothesis,
  type HypothesisStatus,
} from "@/lib/storage/types";
import { cn } from "@/lib/utils";

const COLUMN_HEADING_CLASS: Record<HypothesisStatus, string> = {
  Backlog: "text-zinc-400",
  "Em andamento": "text-amber-400",
  "Concluído — Validada": "text-emerald-400",
  "Concluído — Invalidada": "text-rose-400",
};

type HypothesisKanbanProps = {
  items: Hypothesis[];
  onStatusChange: (id: string, status: HypothesisStatus) => void;
  onDelete: (id: string, nome: string) => void;
};

function sortByCreatedDesc(a: Hypothesis, b: Hypothesis): number {
  return b.criadoEm.localeCompare(a.criadoEm);
}

function HypothesisKanbanCard({
  item,
  onStatusChange,
  onDelete,
}: {
  item: Hypothesis;
  onStatusChange: (id: string, status: HypothesisStatus) => void;
  onDelete: () => void;
}) {
  const statusSelectId = useId();

  return (
    <li className="rounded-md border border-zinc-800 bg-zinc-900/60 p-3 shadow-sm transition-colors duration-150 hover:border-zinc-700">
      <div className="space-y-2">
        <h3 className="text-sm font-medium leading-snug text-zinc-100">
          {item.nome}
        </h3>
        <p className="text-xs leading-relaxed text-zinc-400">{item.metricaSucesso}</p>
        <div className="space-y-1">
          <Label htmlFor={statusSelectId} className="text-xs text-zinc-500">
            Status
          </Label>
          <Select
            value={item.status}
            onValueChange={(value) =>
              onStatusChange(item.id, value as HypothesisStatus)
            }
          >
            <SelectTrigger id={statusSelectId} size="sm" className="w-full min-w-0">
              <SelectValue />
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
        <div className="flex justify-end pt-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 shrink-0 transition-shadow duration-150 hover:shadow-glow-rose"
            aria-label={`Excluir hipótese ${item.nome}`}
            onClick={onDelete}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </li>
  );
}

export function HypothesisKanban({
  items,
  onStatusChange,
  onDelete,
}: HypothesisKanbanProps) {
  return (
    <div className="-mx-1 overflow-x-auto px-1 pb-1 lg:mx-0 lg:overflow-x-visible lg:px-0">
      <div className="flex min-h-[12rem] min-w-min gap-4 lg:min-w-0 lg:gap-6">
        {HYPOTHESIS_STATUS_ORDER.map((status, columnIndex) => {
          const columnItems = items
            .filter((h) => h.status === status)
            .sort(sortByCreatedDesc);
          const headingId = `kanban-col-heading-${columnIndex}`;
          return (
            <section
              key={status}
              className="flex min-w-[260px] shrink-0 flex-col gap-3 lg:min-w-0 lg:flex-1"
              aria-labelledby={headingId}
            >
              <div className="space-y-0.5">
                <h3
                  id={headingId}
                  className={cn(
                    "text-xs font-semibold",
                    COLUMN_HEADING_CLASS[status],
                  )}
                >
                  {status}
                </h3>
                <p className="text-xs text-zinc-500">
                  {columnItems.length}{" "}
                  {columnItems.length === 1 ? "hipótese" : "hipóteses"}
                </p>
              </div>
              <ul className="flex flex-col gap-2">
                {columnItems.map((item) => (
                  <HypothesisKanbanCard
                    key={item.id}
                    item={item}
                    onStatusChange={onStatusChange}
                    onDelete={() => onDelete(item.id, item.nome)}
                  />
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
