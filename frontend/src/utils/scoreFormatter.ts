export function toFixedScore(value: number): string {
  if (Number.isNaN(value)) {
    return "0.00";
  }
  return value.toFixed(2);
}

export function normalizePercent(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.min(100, value));
}
