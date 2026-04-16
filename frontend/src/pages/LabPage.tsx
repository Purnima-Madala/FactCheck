import { motion } from "framer-motion";
import { useMemo } from "react";
import { BattleGraphs } from "../components/ui/BattleGraphs";
import { Leaderboard } from "../components/ui/Leaderboard";
import { MetricsRadar } from "../components/ui/MetricsRadar";
import { ModelCard } from "../components/ui/ModelCard";
import { PromptInput } from "../components/ui/PromptInput";
import { useArenaStore } from "../store/arenaStore";

export default function LabPage() {
  const {
    results,
    loading,
    winner,
    evaluatedAt,
    recommendedAnswer,
    recommendedSources
  } = useArenaStore();

  const cards = loading && results.length === 0 ? [1, 2, 3, 4] : results;
  const winnerName = results.find((item) => item.modelId === winner)?.name || "No winner yet";
  const runnerUp = results[1]?.name || "Pending";
  const bestScore = results[0]?.compositeScore ?? 0;
  const lowestLatency = useMemo(
    () => [...results].sort((left, right) => left.metrics.latencyMs - right.metrics.latencyMs)[0],
    [results]
  );

  return (
    <div className="space-y-8 md:space-y-10">
      <motion.section
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-[28px] p-6 md:p-8 lg:p-10"
      >
        <div className="grid gap-8 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-5">
            <p className="inline-flex rounded-full border border-sky-200/70 bg-sky-50/80 px-3 py-1 text-xs uppercase tracking-[0.16em] text-sky-800">
              Live evaluation report
            </p>
            <h1 className="max-w-3xl font-display text-3xl font-bold leading-tight text-slate-900 md:text-5xl">
              A clean fact-check workspace with the final answer shown first.
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
              Models are compared side-by-side with evidence snippets, ranked bars, and a final trustable answer.
              Run an evaluation to populate this report with real outputs.
            </p>

            <div className="flex flex-wrap gap-3 text-sm text-slate-700">
              <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5">Top result: {winnerName}</span>
              <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5">Runner-up: {runnerUp}</span>
              <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5">
                Updated: {evaluatedAt || "Not evaluated yet"}
              </span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-[24px] border border-sky-100 bg-white/80 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
          >
            <p className="text-xs uppercase tracking-[0.16em] text-sky-700">Final answer</p>
            <p className="mt-3 text-lg leading-8 text-slate-800 md:text-xl">
              {recommendedAnswer || "Run evaluation to generate the final answer."}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-600">
              <SummaryPill label="Composite" value={bestScore ? bestScore.toFixed(2) : "--"} tone="sky" />
              <SummaryPill label="Latency" value={lowestLatency ? `${lowestLatency.metrics.latencyMs}ms` : "--"} tone="teal" />
            </div>
          </motion.div>
        </div>
      </motion.section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Best Composite" value={bestScore ? `${bestScore.toFixed(2)}` : "--"} note="Higher is better" />
        <StatCard label="Fastest Model" value={lowestLatency ? lowestLatency.name : "--"} note="Lowest latency" />
        <StatCard label="Status" value={loading ? "Evaluating models" : "Awaiting evaluation"} note="Real outputs only" />
      </section>

      <div className="grid gap-7 xl:grid-cols-[1fr_1fr] xl:gap-8">
        <div className="space-y-7">
          <Leaderboard results={results} />
          <MetricsRadar results={results} />
        </div>
        <div className="space-y-7">
          <PromptInput />
        </div>
      </div>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((item, idx) =>
          typeof item === "number" ? <ModelCard key={idx} loading /> : <ModelCard key={item.modelId} result={item} />
        )}
      </section>

      <section className="pt-1">
        <BattleGraphs results={results} />
      </section>

      <section className="glass rounded-[28px] p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-sky-700/70">Final recommendation</p>
            <h2 className="mt-2 font-display text-2xl font-semibold md:text-3xl">Comparative trustable answer</h2>
          </div>
          <div className="rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-sm text-slate-700">
            Best supported by the top-ranked model and cross-checked sources
          </div>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[1.3fr_0.9fr]">
          <div className="rounded-[24px] border border-sky-100 bg-white/70 p-4 md:p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-sky-700/70">Recommended answer</p>
            <p className="mt-3 text-sm leading-7 text-slate-700 md:text-base">
              {recommendedAnswer || "Run the comparison to generate the final recommendation."}
            </p>
          </div>

          <div className="rounded-[24px] border border-sky-100 bg-white/70 p-4 md:p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-sky-700/70">Supporting sources</p>
            <div className="mt-3 space-y-2">
              {recommendedSources.length ? (
                recommendedSources.map((source) => (
                  <a
                    key={source.url}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl border border-slate-200 bg-slate-50/90 px-3 py-2 transition hover:border-sky-200 hover:bg-sky-50"
                  >
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-medium text-slate-800">{source.title}</span>
                      <span className="text-slate-500">{source.publisher}</span>
                    </div>
                    <p className="mt-1 text-[11px] leading-5 text-slate-500">{source.excerpt}</p>
                  </a>
                ))
              ) : (
                <p className="text-sm text-slate-500">Sources will appear here after the first comparison.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass rounded-[24px] p-5"
    >
      <p className="text-xs uppercase tracking-[0.16em] text-sky-700/70">{label}</p>
      <p className="mt-2 font-display text-xl font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{note}</p>
    </motion.article>
  );
}

function SummaryPill({ label, value, tone }: { label: string; value: string; tone: "sky" | "teal" }) {
  const toneClass = tone === "sky" ? "bg-sky-50 border-sky-100 text-sky-800" : "bg-teal-50 border-teal-100 text-teal-800";

  return (
    <div className={`rounded-2xl border px-3 py-2 ${toneClass}`}>
      <p className="text-[10px] uppercase tracking-[0.16em]">{label}</p>
      <p className="mt-1 font-display text-base font-semibold">{value}</p>
    </div>
  );
}
