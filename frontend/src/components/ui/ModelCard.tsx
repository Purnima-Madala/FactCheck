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

      <p className="mb-4 max-h-28 overflow-auto text-sm leading-7 text-slate-700">{result.error || result.response}</p>

      <div className="mb-4 space-y-2 rounded-2xl border border-sky-100 bg-sky-50/60 p-3">
        <p className="text-[10px] uppercase tracking-[0.16em] text-sky-700/70">Sources</p>
        <div className="space-y-2">
          {result.sources.map((source) => (
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
          ))}
        </div>
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
