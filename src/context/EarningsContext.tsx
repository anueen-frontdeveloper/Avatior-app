import React, { createContext, useContext, useState, ReactNode } from "react";
import { Bet } from "../components/BetHistory"; // adjust the import path

interface EarningsContextValue {
  totalEarnings: number;
  totalBetAmount: number;
  withdrawCash: number;
  addEarnings: (amount: number) => void;
  updateTotals: (bets: Bet[]) => void;
}

const EarningsContext = createContext<EarningsContextValue | undefined>(undefined);

export const EarningsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalBetAmount, setTotalBetAmount] = useState(0);
  const [withdrawCash, setWithdrawCash] = useState(0);

  const addEarnings = (amount: number) => {
    if (amount > 0) setTotalEarnings((prev) => prev + amount);
  };

  const updateTotals = (bets: Bet[]) => {
    let lost = 0;
    let withdraws = 0;
    for (const b of bets) {
      if (b.cashout !== undefined) withdraws += b.cashout;
      else lost += b.bet;
    }
    setTotalBetAmount(lost);
    setWithdrawCash(withdraws);
  };

  return (
    <EarningsContext.Provider
      value={{ totalEarnings, totalBetAmount, withdrawCash, addEarnings, updateTotals }}
    >
      {children}
    </EarningsContext.Provider>
  );
};

export const useEarnings = (): EarningsContextValue => {
  const ctx = useContext(EarningsContext);
  if (!ctx) throw new Error("useEarnings must be used inside an EarningsProvider");
  return ctx;
};