import { motion } from "framer-motion";
import type { ModelResult } from "../../types";
import { toFixedScore } from "../../utils/scoreFormatter";
import { HallucBadge } from "./HallucBadge";

interface ModelCardProps {
  result?: ModelResult;
  loading?: boolean;
}

export function ModelCard({ result, loading = false }: ModelCardProps) {
  if (loading || !result) {
    return (
      <div className="glass h-72 animate-pulse rounded-2xl p-5">
        <div className="mb-3 h-5 w-2/3 rounded bg-slate-700/60" />
        <div className="mb-5 h-4 w-1/2 rounded bg-slate-700/60" />
        <div className="mb-2 h-3 w-full rounded bg-slate-700/60" />
        <div className="mb-2 h-3 w-5/6 rounded bg-slate-700/60" />
        <div className="mb-2 h-3 w-4/6 rounded bg-slate-700/60" />
      </div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="glass rounded-[24px] p-5 shadow-[0_12px_34px_rgba(15,23,42,0.06)]"
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="font-display text-lg font-semibold text-slate-900">{result.name}</h3>
        <span className="rounded-full bg-sky-100 px-3 py-1 font-mono text-xs text-sky-800">
          Composite {toFixedScore(result.compositeScore)}
        </span>
      </div>

      <div className="mb-3">
        <HallucBadge hallucinationRate={result.metrics.hallucinationRate} />
      </div>

      <div className="mb-4 rounded-2xl border border-rose-100 bg-rose-50/60 p-3">
        <div className="mb-2 flex items-center justify-between gap-2 text-[11px] uppercase tracking-[0.14em]">
          <span className="text-rose-700/80">Hallucination Meter</span>
          <span className="font-mono text-rose-700">{toFixedScore(result.metrics.hallucinationRate)}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-rose-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-amber-300 to-rose-400"
            style={{ width: `${Math.max(2, Math.min(100, result.metrics.hallucinationRate))}%` }}
          />
        </div>
        <p className="mt-2 text-[11px] text-slate-600">
          Flagged claims: {result.metrics.hallucinationFlaggedClaims ?? 0}/
          {result.metrics.hallucinationTotalClaims ?? 0}
        </p>
      </div>

      <div className="mb-4 rounded-2xl border border-slate-200 bg-white/70 p-3">
        <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Real Model Response</p>
        <p className="mt-2 max-h-32 overflow-auto text-sm leading-7 text-slate-700">{result.response || "No response returned by backend."}</p>
        {result.error ? <p className="mt-2 text-xs text-rose-600">Model error: {result.error}</p> : null}
      </div>

      <div className="mb-4 space-y-2 rounded-2xl border border-sky-100 bg-sky-50/60 p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] uppercase tracking-[0.16em] text-sky-700/70">Referenced Sources</p>
          <span className="rounded-full bg-white px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-slate-500">
            {result.sourceMode === "provider" ? "provider" : "fallback"}
          </span>
        </div>
        <div className="space-y-2">
          {result.sources.length ? result.sources.map((source) => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="block rounded-xl border border-slate-200 bg-white/75 px-3 py-2 transition hover:border-sky-200 hover:bg-sky-50"
            >
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="font-medium text-slate-800">{source.title}</span>
                <span className="text-slate-500">{source.publisher}</span>
              </div>
              <p className="mt-1 text-[11px] leading-5 text-slate-500">{source.excerpt}</p>
            </a>
          )) : <p className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-[11px] text-slate-500">No provider references returned for this response.</p>}
        </div>
      </div>

      <div className="mb-4 space-y-2 rounded-2xl border border-teal-100 bg-teal-50/55 p-3">
        <p className="text-[10px] uppercase tracking-[0.16em] text-teal-700/70">Scoring Basis</p>
        <p className="text-[11px] leading-5 text-slate-600">
          <span className="font-semibold text-slate-700">Hallucination:</span>{" "}
          {result.basis?.hallucination || "Estimated by checking contradictory unique claims against consensus."}
        </p>
        <p className="text-[11px] leading-5 text-slate-600">
          <span className="font-semibold text-slate-700">Correctness:</span>{" "}
          {result.basis?.correctness || "Estimated by reference overlap or cross-model consensus similarity."}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs text-slate-600">
        <MetricRow label="Correctness" value={result.metrics.correctnessScore} />
        <MetricRow label="Relevance" value={result.metrics.relevanceScore} />
        <MetricRow label="Confidence" value={result.metrics.confidenceScore} />
        <MetricRow label="Hallucination" value={result.metrics.hallucinationRate} />
        <MetricRow label="Latency (ms)" value={result.metrics.latencyMs} raw />
        <MetricRow label="Tokens" value={result.metrics.tokensUsed} raw />
      </div>
    </motion.article>
  );
}

function MetricRow({ label, value, raw = false }: { label: string; value: number; raw?: boolean }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/70 px-2 py-1.5">
      <p className="text-[10px] uppercase text-sky-700/70">{label}</p>
      <p className="text-sm font-medium text-slate-800">{raw ? value : toFixedScore(value)}</p>
    </div>
  );
}
