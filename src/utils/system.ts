// src/utils/system.ts
export type PayoutResult = {
  userGain: number;
  systemGain: number;
  totalWin: number;
};

/** Split game payouts: user = 70 %, system = 30 % */
export const calculatePayout = (
  bet: number,
  multiplier: number
): PayoutResult => {
  const totalWin = bet * multiplier;
  const userGain = totalWin * 0.7;
  const systemGain = totalWin * 0.3;
  return { userGain, systemGain, totalWin };
};