import React, { createContext, useContext, useState } from "react";

type BalanceContextType = {
  balance: number | null;
  setBalance: React.Dispatch<React.SetStateAction<number | null>>;
};

export const BalanceContext = createContext<BalanceContextType | null>(null);

export const BalanceProvider = ({ children }: { children: React.ReactNode }) => {
  // 👇 Start with null placeholder; truly dynamic
  const [balance, setBalance] = useState<number | null>(null);

  return (
    <BalanceContext.Provider value={{ balance, setBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useTotalBet = () => {
  const ctx = useContext(BalanceContext);
  if (!ctx) throw new Error("useTotalBet must be used inside BalanceProvider");
  return ctx;
};