import { cn } from "@/lib/utils";
import type { HypothesisStatus } from "@/lib/storage/types";

const STATUS_CLASS: Record<HypothesisStatus, string> = {
  Backlog: "text-zinc-400",
  "Em andamento": "text-amber-400",
  "Concluído — Validada": "text-emerald-400",
  "Concluído — Invalidada": "text-rose-400",
};

export function StatusText({ status }: { status: HypothesisStatus }) {
  return (
    <p className={cn("text-sm", STATUS_CLASS[status])}>{status}</p>
  );
}
