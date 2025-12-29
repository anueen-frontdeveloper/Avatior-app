import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

// 1. Define the Bet Type here so it's shared
export type Bet = {
  id: string;
  user: string;
  bet: number;
  multiplierTarget?: number;
  isVisible?: boolean;
  multiplier?: number;
  cashout?: number;
  isMine?: boolean;
  avatar?: string;
  didLose?: boolean;
  date?: string;
};

interface EarningsContextType {
  balance: number;
  bets: Bet[]; // <--- The Master List of Bets
  fakeTotalUsers: number; // <--- The "10k" number
  roundWinTotal: number;  // <--- Total money won this round
  
  // Actions
  placeBet: (amount: number) => boolean;
  addEarnings: (amount: number) => void;
  
  // Game Lifecycle Actions (Called by the Game Engine)
  initializeRound: () => void; // Generates bots
  updateGameTick: (liveMultiplier: number) => void; // Updates cashouts
  finalizeRound: () => void; // Marks losers
}

const EarningsContext = createContext<EarningsContextType | undefined>(undefined);

export const EarningsProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState(10000);
  const [bets, setBets] = useState<Bet[]>([]);
  const [fakeTotalUsers, setFakeTotalUsers] = useState(9432);
  const [roundWinTotal, setRoundWinTotal] = useState(0);

  // --- 1. USER ACTIONS ---
  const placeBet = (amount: number) => {
    if (balance >= amount) {
      setBalance((prev) => prev - amount);
      // Add "You" to the bets list immediately
      const myBet: Bet = {
        id: "you",
        user: "You",
        bet: amount,
        isMine: true,
        avatar: "https://i.pravatar.cc/40?img=0",
        isVisible: true,
        didLose: false,
      };
      
      // We prepend "You" to the existing list
      setBets(prev => {
         // Remove old "You" if exists
         const others = prev.filter(b => !b.isMine);
         return [myBet, ...others];
      });
      return true;
    }
    return false;
  };

  const addEarnings = (amount: number) => {
    setBalance((prev) => prev + amount);
  };

  // --- 2. BOT LOGIC (MOVED FROM COMPONENT TO CONTEXT) ---
  const initializeRound = () => {
    // A. Generate Fake User Count
    setFakeTotalUsers(Math.floor(Math.random() * 3000) + 8500);

    // B. Generate 200 Bots
    const botCount = 200; 
    const randomBets: Bet[] = Array.from({ length: botCount }).map((_, i) => {
      // 40% Safe (1.1x - 1.5x), 40% Medium (1.5x - 3x), 20% Risky (3x - 100x)
      const risk = Math.random();
      let target;
      
      if (risk < 0.4) target = parseFloat((Math.random() * 0.4 + 1.1).toFixed(2));
      else if (risk < 0.8) target = parseFloat((Math.random() * 1.5 + 1.5).toFixed(2));
      else target = parseFloat((Math.random() * 50 + 3.0).toFixed(2));

      return {
        id: `bot_${i}`,
        user: `User${Math.floor(Math.random() * 90000) + 10000}`,
        bet: Math.floor(Math.random() * 10000) + 100,
        multiplierTarget: target,
        avatar: `https://i.pravatar.cc/40?img=${(i % 50) + 1}`,
        isVisible: true,
        didLose: false,
      };
    });

    // C. Preserve "You" if you bet previously, but reset your status
    setBets(prev => {
      const myBet = prev.find(b => b.isMine);
      const cleanMine = myBet ? { 
        ...myBet, 
        cashout: undefined, 
        multiplier: undefined, 
        didLose: false 
      } : null;

      return cleanMine ? [cleanMine, ...randomBets] : [...randomBets];
    });
    
    setRoundWinTotal(0);
  };

  const updateGameTick = (liveMultiplier: number) => {
    setBets(prev => {
      let totalWin = 0;
      
      const newBets = prev.map(b => {
        // Skip "You" (handled by Game logic) or already cashed out
        if (b.isMine || b.cashout !== undefined) {
          if (b.cashout) totalWin += b.cashout;
          return b;
        }

        // Check if Bot hits target
        if (b.multiplierTarget && liveMultiplier >= b.multiplierTarget) {
          const winAmount = b.bet * b.multiplierTarget;
          totalWin += winAmount;
          return {
            ...b,
            multiplier: b.multiplierTarget,
            cashout: winAmount,
          };
        }
        return b;
      });

      setRoundWinTotal(totalWin);
      return newBets;
    });
  };

  const finalizeRound = () => {
    setBets(prev => prev.map(b => {
      if (b.cashout === undefined) {
        return { ...b, didLose: true };
      }
      return b;
    }));
  };

  return (
    <EarningsContext.Provider
      value={{
        balance,
        bets,
        fakeTotalUsers,
        roundWinTotal,
        placeBet,
        addEarnings,
        initializeRound,
        updateGameTick,
        finalizeRound,
      }}
    >
      {children}
    </EarningsContext.Provider>
  );
};

export const useEarnings = () => {
  const context = useContext(EarningsContext);
  if (!context) throw new Error("useEarnings must be used within EarningsProvider");
  return context;
};