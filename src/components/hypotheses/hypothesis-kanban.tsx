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
    <li className="rounded-md border border-zinc-800 bg-zinc-950/50 p-3 shadow-sm">
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
            className="size-8 shrink-0"
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
    <div className="-mx-1 overflow-x-auto px-1 pb-1">
      <div className="flex min-h-[12rem] min-w-min gap-4">
        {HYPOTHESIS_STATUS_ORDER.map((status, columnIndex) => {
          const columnItems = items
            .filter((h) => h.status === status)
            .sort(sortByCreatedDesc);
          const headingId = `kanban-col-heading-${columnIndex}`;
          return (
            <section
              key={status}
              className="flex w-[min(100%,280px)] shrink-0 flex-col gap-3"
              aria-labelledby={headingId}
            >
              <div className="space-y-0.5">
                <h3
                  id={headingId}
                  className="text-xs font-semibold text-zinc-300"
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
