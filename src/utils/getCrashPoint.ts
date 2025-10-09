// 💥 Simple crash point generator
// Decides when the plane will "fly away"

type CrashOptions = {
  totalBetAmount: number;  // How much the player has bet
  cashouttotal: number;    // How much the player already took out
};

export function getCrashPoint(options: CrashOptions): number {
  const total = options.totalBetAmount;
  const cashout = options.cashouttotal;

  const luck = Math.random();

  const base = 1 + Math.random() * 10;

  const tooMuch = 0.7;
  if (cashout >= tooMuch * total) {

    const halfBase = base * 0.5;
    const crashLow = Math.max(1, halfBase);   // at least 1x
    const crashHigh = Math.min(tooMuch, crashLow); // not above 0.7x
    return crashHigh;
  }

  // 🎲 30% of the time = instant crash (bad luck)
  if (luck < 0.3) {
    const crashEarly = base * 0.5; // small crash
    return Math.max(1, crashEarly); // at least 1x
  }

  const random = Math.random() * 50;   // random 0–50
  const crash = 1 + Math.pow(random, 1.2) / 10;


  return Math.min(crash, 100); // never above 100x
}