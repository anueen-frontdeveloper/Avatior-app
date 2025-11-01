export type CrashOptions = {
  totalBetAmount: number;
  cashouttotal: number;
};

export function getCrashPoint(options: CrashOptions): number {
  const { totalBetAmount: total, cashouttotal: cashout } = options;

  // Unified random crash system — same logic always
  const luck = Math.random();
  let crashPoint: number;

  if (luck < 0.6) {
    // 40% chance: early bust 1–2x
    crashPoint = +(1 + Math.random() * 1).toFixed(2);
  } 
  else if (luck < 0.8) {
    // 40% chance: decent 2–10x
    crashPoint = +(2 + Math.random() * 8).toFixed(2);
  } else if (luck < 0.97) {
    // 17% chance: excellent 10–30x
    crashPoint = +(10 + Math.random() * 20).toFixed(2);
  } 
  else {
    // 3% chance: legendary 30–100x
    crashPoint = +(30 + Math.random() * 70).toFixed(2);
  }

  return crashPoint;
}
