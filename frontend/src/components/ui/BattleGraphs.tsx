import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { ModelResult } from "../../types";
import { MODEL_SELECTION } from "../../store/arenaStore";

interface BattleGraphsProps {
  results: ModelResult[];
}

export function BattleGraphs({ results }: BattleGraphsProps) {
  const withFallback = results.length
    ? results
    : MODEL_SELECTION.map((model) => ({
        modelId: model.id,
        name: model.name,
        compositeScore: 0,
        metrics: {
          correctnessScore: 0,
          relevanceScore: 0,
          confidenceScore: 0,
          hallucinationRate: 0,
          latencyMs: 0,
          tokensUsed: 0
        }
      }));

  const qualityBars = withFallback.map((result) => ({
    name: shortName(result.name),
    composite: result.compositeScore,
    relevance: result.metrics.relevanceScore,
    correctness: result.metrics.correctnessScore
  }));

  const efficiencyTrend = withFallback
    .map((result) => {
      const tokenEfficiency = result.metrics.tokensUsed
        ? (result.compositeScore / result.metrics.tokensUsed) * 1000
        : 0;
      return {
        name: shortName(result.name),
        latency: result.metrics.latencyMs,
        efficiency: Number(tokenEfficiency.toFixed(2))
      };
    })
    .sort((a, b) => a.latency - b.latency);

  const bestResult = withFallback[0];
  const secondResult = withFallback[1];

  return (
    <section className="space-y-4">
      <div className="glass rounded-[24px] p-4 md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-lg text-slate-900">Truth Quality Spectrum</h3>
            <p className="mt-1 text-sm text-slate-600">Composite and sub-score comparison across all selected models.</p>
          </div>
          {bestResult ? (
            <div className="flex flex-wrap gap-2 text-xs text-slate-700">
              <span className="rounded-full border border-sky-100 bg-sky-50 px-3 py-1">
                Leader: {shortName(bestResult.name)}
              </span>
              {secondResult ? (
                <span className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1">
                  Runner-up: {shortName(secondResult.name)}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="h-[290px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={qualityBars}>
                <CartesianGrid strokeDasharray="2 4" stroke="rgba(125,145,175,0.18)" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip
                  cursor={{ fill: "rgba(226, 232, 240, 0.55)" }}
                  contentStyle={{
                    background: "rgba(255,255,255,0.95)",
                    border: "1px solid rgba(148,163,184,0.22)",
                    borderRadius: "10px",
                    color: "#0f172a"
                  }}
                />
                <Bar dataKey="correctness" fill="#93c5fd" radius={[8, 8, 0, 0]} isAnimationActive animationDuration={900} />
                <Bar dataKey="relevance" fill="#99f6e4" radius={[8, 8, 0, 0]} isAnimationActive animationDuration={1100} />
                <Bar dataKey="composite" fill="#cbd5e1" radius={[8, 8, 0, 0]} isAnimationActive animationDuration={1300} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3 rounded-[24px] border border-slate-200 bg-white/75 p-4">
            <p className="font-display text-sm uppercase tracking-[0.16em] text-sky-700/70">Comparator Snapshot</p>
            {withFallback.map((result, index) => (
              <motion.div
                key={result.modelId}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50/80 p-3"
              >
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-slate-800">{shortName(result.name)}</span>
                  <span className="font-mono text-slate-600">{result.compositeScore.toFixed(2)}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-300 via-teal-300 to-stone-300"
                    style={{ width: `${Math.max(10, Math.min(100, result.compositeScore))}%` }}
                  />
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] text-slate-500">
                  <span>Correctness {result.metrics.correctnessScore.toFixed(0)}</span>
                  <span>Relevance {result.metrics.relevanceScore.toFixed(0)}</span>
                  <span>Confidence {result.metrics.confidenceScore.toFixed(0)}</span>
                  <span>Latency {result.metrics.latencyMs.toFixed(0)}ms</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="glass h-[290px] rounded-[24px] p-4 md:p-5">
          <h3 className="mb-3 font-display text-lg text-slate-900">Truth Quality Spectrum</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={qualityBars}>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(125,145,175,0.18)" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <Tooltip
                cursor={{ fill: "rgba(226, 232, 240, 0.55)" }}
                contentStyle={{
                  background: "rgba(255,255,255,0.95)",
                  border: "1px solid rgba(148,163,184,0.22)",
                  borderRadius: "10px",
                  color: "#0f172a"
                }}
              />
              <Bar dataKey="correctness" fill="#93c5fd" radius={[8, 8, 0, 0]} isAnimationActive animationDuration={900} />
              <Bar dataKey="relevance" fill="#99f6e4" radius={[8, 8, 0, 0]} isAnimationActive animationDuration={1100} />
              <Bar dataKey="composite" fill="#cbd5e1" radius={[8, 8, 0, 0]} isAnimationActive animationDuration={1300} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass h-[290px] rounded-[24px] p-4 md:p-5">
          <h3 className="mb-3 font-display text-lg text-slate-900">Response Speed vs Truth Efficiency</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={efficiencyTrend}>
              <defs>
                <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#93c5fd" stopOpacity={0.75} />
                  <stop offset="95%" stopColor="#93c5fd" stopOpacity={0.06} />
                </linearGradient>
                <linearGradient id="effGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#99f6e4" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#99f6e4" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(125,145,175,0.18)" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(255,255,255,0.95)",
                  border: "1px solid rgba(148,163,184,0.22)",
                  borderRadius: "10px",
                  color: "#0f172a"
                }}
              />
              <Area type="monotone" dataKey="latency" stroke="#93c5fd" fill="url(#latencyGrad)" isAnimationActive animationDuration={1000} />
              <Area type="monotone" dataKey="efficiency" stroke="#99f6e4" fill="url(#effGrad)" isAnimationActive animationDuration={1200} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

function shortName(name: string) {
  return name.replace("OpenAI ", "").replace("Anthropic ", "").replace("Google ", "").replace("Cohere ", "");
}
