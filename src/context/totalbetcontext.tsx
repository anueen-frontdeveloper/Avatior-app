import React, { createContext, useContext, useState } from "react";

export const TotalBetContext = createContext<any>(null);

export const TotalBetProvider = ({ children }: any) => {
  const [balance, setBalance] = useState(1000);

  return (
    <TotalBetContext.Provider value={{ balance, setBalance }}>
      {children}
    </TotalBetContext.Provider>
  );
};

export const useTotalBet = () => useContext(TotalBetContext);