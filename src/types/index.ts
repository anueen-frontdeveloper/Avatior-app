// src/types/index.ts

export type Bet = {
  id: string;
  user: string;        // username or user id
  avatar?: string;     // optional image URL
  bet: number;         // bet amount
  multiplier: number;  // x2, x5, etc.
  cashout?: number;    // amount cashed out
  result?: "win" | "lose";
  createdAt?: string;  // optional timestamp
};
