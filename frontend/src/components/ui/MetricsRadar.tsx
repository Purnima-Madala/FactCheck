import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend
} from "recharts";
import type { ModelResult } from "../../types";
import { MODEL_SELECTION } from "../../store/arenaStore";

interface MetricsRadarProps {
  results: ModelResult[];
}

const axes = [
  "correctnessScore",
  "relevanceScore",
  "confidenceScore",
  "compositeScore",
  "hallucinationInverted"
] as const;

export function MetricsRadar({ results }: MetricsRadarProps) {
  if (results.length === 0) {
    return (
      <div className="glass flex h-[360px] items-center justify-center rounded-[24px] p-5 text-center">
        <div>
          <h3 className="font-display text-lg text-slate-900">Truth Signal Radar</h3>
          <p className="mt-2 text-sm text-slate-600">Radar insights will appear after your first evaluation.</p>
        </div>
      </div>
    );
  }

  const data = axes.map((axis) => {
    const labelMap: Record<(typeof axes)[number], string> = {
      correctnessScore: "Correctness",
      relevanceScore: "Relevance",
      confidenceScore: "Confidence",
      compositeScore: "Composite",
      hallucinationInverted: "Factual Safety"
    };

    const row: Record<string, string | number> = { metric: labelMap[axis] };
    results.forEach((result) => {
      row[result.modelId] =
        axis === "compositeScore"
          ? result.compositeScore
          : axis === "hallucinationInverted"
            ? 100 - result.metrics.hallucinationRate
            : result.metrics[axis];
    });
    return row;
  });

  return (
    <div className="glass h-[360px] rounded-[24px] p-4 md:p-5">
      <h3 className="mb-4 font-display text-lg text-slate-900">Truth Signal Radar</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(148, 163, 184, 0.18)" />
          <PolarAngleAxis dataKey="metric" stroke="#64748b" />
          <PolarRadiusAxis domain={[0, 100]} stroke="#94a3b8" />
          <Legend />
          {results.map((result) => {
            const color = MODEL_SELECTION.find((m) => m.id === result.modelId)?.color || "#38bdf8";
            return (
              <Radar
                key={result.modelId}
                dataKey={result.modelId}
                stroke={color}
                fill={color}
                fillOpacity={0.16}
                strokeWidth={2}
                name={result.name}
              />
            );
          })}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
