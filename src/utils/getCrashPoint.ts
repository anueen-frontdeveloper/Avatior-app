export type CrashOptions = {
  totalBetAmount: number;
  cashouttotal: number;
};

export function getCrashPoint(options: CrashOptions): number {
  const { totalBetAmount: total, cashouttotal: cashout } = options;

  const luck = Math.random();
  let crashPoint: number;

  if (luck < 0.6) {
    crashPoint = +(1 + Math.random() * 1).toFixed(2);
  } 
  else if (luck < 0.8) {
    crashPoint = +(2 + Math.random() * 8).toFixed(2);
  } else if (luck < 0.97) {
    crashPoint = +(10 + Math.random() * 20).toFixed(2);
  } 
  else {
    crashPoint = +(30 + Math.random() * 70).toFixed(2);
  }

  return crashPoint;
}
