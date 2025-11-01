export type PayoutResult = {
  userGain: number;   // what the player receives (full payout)
  systemGain: number; // the house share — now always 0
  totalWin: number;   // bet × multiplier
};

/** Award 100 % of winnings to the player (no house split). */
export const calculatePayout = (
  bet: number,
  multiplier: number
): PayoutResult => {
  const totalWin = bet * multiplier;      // full payout (stake + profit)
  const userGain = totalWin;
  const systemGain = 0;
  return { userGain, systemGain, totalWin };
};