// src/utils/getCrashPoint.ts

export type CrashOptions = {
  totalBetAmount: number;
  cashouttotal: number;
};

export function getCrashPoint(options: CrashOptions): number {
  const luck = Math.random();
  let crashPoint: number;

  // 1. INSTANT CRASH / LOW (1.00x - 1.50x)
  if (luck < 0.35) {
    crashPoint = 1 + Math.random() * 0.5;
  }

  // 2. MEDIUM LOW (1.50x - 2.50x)
  else if (luck < 0.70) {
    crashPoint = 1.5 + Math.random();
  }

  // 3. MEDIUM HIGH (2.50x - 10.00x)
  else if (luck < 0.90) {
    crashPoint = 2.5 + Math.random() * 7.5;
  }

  // 4. HIGH (10.00x - 50.00x)
  else if (luck < 0.98) {
    crashPoint = 10 + Math.random() * 40;
  }

  // 5. JACKPOT (50.00x +)
  else {
    crashPoint = 50 + Math.random() * 150; // Up to 200x
  }

  if (crashPoint < 1) crashPoint = 1;

  return +(crashPoint.toFixed(2));
}