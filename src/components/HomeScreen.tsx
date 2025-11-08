// ✅ HomeScreen.tsx
import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Header from "./Header";
import BalanceHeader from "./BalanceHeader";
import MultipliersBar from "./MultipliersBar";
import GameBoard from "./GameBoard";
import BetBox from "./BetBox";
import BetHistory, { Bet } from "./BetHistory";
import { calculatePayout } from "../utils/system";
import { useTotalBet } from "../context/BalanceContext";
import { EarningsProvider } from "../context/EarningsContext";

const HomeScreen: React.FC = () => {
  const { balance, setBalance } = useTotalBet();
  const [betBoxes, setBetBoxes] = useState<number[]>([Date.now()]);
  const [bets, setBets] = useState<Bet[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [liveMultiplier, setLiveMultiplier] = useState(1);
  const [multipliers, setMultipliers] = useState<string[]>([]);

  // --- add bet box (max 2 only)
  const addBetBox = () => {
    if (betBoxes.length < 2) {
      setBetBoxes((prev) => [...prev, Date.now()]);
    }
  };

  // --- remove bet box
  const removeBetBox = (id: number) => {
    setBetBoxes((prev) => prev.filter((boxId) => boxId !== id));
  };

  const handlePlaceBet = (amount: number) => {
    if ((balance ?? 0) >= amount) {
      setBalance((prev) => (prev ?? 0) - amount);
      
    }
  };

  const handleCashOut = (amount: number, multiplier: number) => {
    const { userGain } = calculatePayout(amount, multiplier);
    setBalance((prev) => (prev ?? 0) + userGain);
  };

  const handleCancelBet = (amount: number) => {
    setBalance((prev) => (prev ?? 0) + amount);
  };

  return (
    <EarningsProvider>
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 10 }}
          stickyHeaderIndices={[0]}
        >
          <Header />
          <BalanceHeader />
          <MultipliersBar multipliers={multipliers} />
          <GameBoard
            bets={bets}
            onUpdate={(val: number, running: boolean) => {
              setLiveMultiplier(val);
              setIsRunning(running);
            }}
          />
          {/* ✅ Dynamically render up to two BetBoxes */}
          {betBoxes.map((id, index) => (
            <BetBox
              key={id}
              id={id}
              balance={balance ?? 0}
              liveMultiplier={liveMultiplier}
              isRunning={isRunning}
              onPlaceBet={handlePlaceBet}
              onCashOut={handleCashOut}
              onCancelBet={handleCancelBet}
              onAdd={index === 0 && betBoxes.length < 2 ? addBetBox : undefined} // ✅ show Add only on 1st
              onRemove={index === 1 ? () => removeBetBox(id) : undefined}       // ✅ show Remove only on 2nd
            />
          ))}

          <BetHistory
            liveMultiplier={liveMultiplier}
            isRunning={isRunning}
            bets={bets}
            setBets={setBets}
          />
        </ScrollView>
      </View>
    </EarningsProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111" },
});

export default HomeScreen;
