import { HypothesisTracker } from "@/components/hypotheses/hypothesis-tracker";

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl space-y-8 px-4 py-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Product Experiment Tracker
        </h1>
        <p className="text-sm text-zinc-400">
          Cadastre e acompanhe hipóteses de experimento; dados ficam apenas no
          seu navegador.
        </p>
      </header>
      <HypothesisTracker />
    </main>
  );
}
