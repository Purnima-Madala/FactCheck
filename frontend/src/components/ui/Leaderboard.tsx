import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { ModelResult } from "../../types";

interface LeaderboardProps {
  results: ModelResult[];
}

export function Leaderboard({ results }: LeaderboardProps) {
  return (
    <div className="glass rounded-[24px] p-4 md:p-5">
      <h3 className="mb-3 font-display text-lg text-slate-900">Truth Ranking</h3>
      {results.length === 0 ? (
        <p className="rounded-2xl border border-sky-100 bg-sky-50/70 px-3 py-6 text-center text-sm text-slate-600">
          Run a fact check to populate ranking results.
        </p>
      ) : (
        <div className="space-y-2.5">
          {results.map((item, idx) => (
            <LeaderboardRow key={item.modelId} rank={idx + 1} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function LeaderboardRow({ rank, item }: { rank: number; item: ModelResult }) {
  const [displayRank, setDisplayRank] = useState(0);

  useEffect(() => {
    const duration = 350;
    const started = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - started) / duration, 1);
      setDisplayRank(Math.max(1, Math.round(progress * rank)));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [rank]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/75 px-3 py-2 shadow-sm"
    >
      <div className="flex items-center gap-2">
        <span className="font-mono text-sky-700">#{displayRank}</span>
        <span className="text-slate-800">{item.name}</span>
      </div>
      <span className="font-mono text-sm text-slate-700">{item.compositeScore.toFixed(2)}</span>
    </motion.div>
  );
}
