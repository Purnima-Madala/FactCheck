interface HallucBadgeProps {
  hallucinationRate: number;
}

export function HallucBadge({ hallucinationRate }: HallucBadgeProps) {
  const risk =
    hallucinationRate < 20 ? "Low" : hallucinationRate < 45 ? "Medium" : "High";

  const classes =
    risk === "Low"
      ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/40"
      : risk === "Medium"
        ? "bg-amber-500/20 text-amber-300 border-amber-400/40"
        : "bg-rose-500/20 text-rose-300 border-rose-400/40";

  return (
    <span className={`rounded-full border px-2 py-1 text-xs font-medium ${classes}`}>
      Hallucination Risk: {risk}
    </span>
  );
}
