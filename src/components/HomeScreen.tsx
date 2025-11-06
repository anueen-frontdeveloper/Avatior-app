// src/components/HomeScreen.tsx                                                                                                                     
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
import { SafeAreaView } from "react-native-safe-area-context";

function getWeightedMultiplier() {
  const roll = Math.random() * 100; // 0–100

  // 90% chance: normal range 1x–2x
  if (roll < 90) {
    return `${(Math.random() * (2 - 1) + 1).toFixed(2)}x`;
  }

  // 10% chance: lucky range 2x–50x
  return `${(Math.random() * (500 - 2) + 2).toFixed(2)}x`;
}


const HomeScreen: React.FC = () => {
  const { balance, setBalance } = useTotalBet();
  const [betBoxes, setBetBoxes] = useState<number[]>([Date.now()]);
  const [systemEarning, setSystemEarning] = useState(0);
  const [bets, setBets] = useState<Bet[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [liveMultiplier, setLiveMultiplier] = useState(1);
  const [totalWinUser, setTotalWinUser] = useState(0);
  const [multipliers, setMultipliers] = useState<string[]>(
    Array.from({ length: 6 }, () => getWeightedMultiplier())
  );
  useEffect(() => {
    const loadBalance = async () => {
      if (balance === null) {
        // could fetch from API or AsyncStorage
        const fetched = 0; // dynamic value later
        setBalance(fetched);
      }
    };
    loadBalance();
  }, [balance]);

  // --- Game events --------------------------------------------------------
  const handleCrash = (val: number) => {
    setMultipliers((prev) => [`${val.toFixed(2)}x`, ...prev].slice(0, 20));
  };
  const handleCancelBet = (amount: number) => {
    setBalance((prev) => (prev ?? 0) + amount);
  };

  const handleUpdate = (val: number, running: boolean) => {
    setLiveMultiplier(val);
    setIsRunning(running);
  };

  // --- Betting ------------------------------------------------------------
  const handlePlaceBet = (amount: number) => {
    const currentBalance = balance ?? 0;       // fallback to 0 if null
    if (currentBalance >= amount) {
      setBalance((prev) => (prev ?? 0) - amount);
      setBets((prev) =>
        prev.map((b) =>
          b.user === "You"
            ? { ...b, bet: amount, isVisible: true }
            : b
        )
      );
    }
  };
  const handleCashOut = (amount: number, multiplier: number) => {
    const { userGain, systemGain } = calculatePayout(amount, multiplier);

    setBalance((prev) => (prev ?? 0) + userGain);
    setSystemEarning((prev) => prev + systemGain); // 30 % to system

    // Update "You" bet in BetHistory
    setBets((prev) =>
      prev.map((b) =>
        b.isMine && b.cashout === undefined
          ? { ...b, multiplier: liveMultiplier, cashout: b.bet * liveMultiplier }
          : b
      )
    );

    console.log(`Round: user ₹${userGain.toFixed(2)}, system ₹${systemGain.toFixed(2)}`);
  };

  useEffect(() => {
    setIsRunning(true);
  }, []);
  const addBetBox = () => {
    if (betBoxes.length < 2) setBetBoxes((prev) => [...prev, Date.now()]);
  };

  const removeBetBox = (id: number) =>
    setBetBoxes((prev) => prev.filter((boxId) => boxId !== id));

  // --- Rendering ----------------------------------------------------------
  return (
    <EarningsProvider>

      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 10 }}
          stickyHeaderIndices={[0]}
          nestedScrollEnabled={true}
        >

          <Header />
          <BalanceHeader />
          <MultipliersBar multipliers={multipliers} />
          <GameBoard bets={bets} onCrash={handleCrash} onUpdate={handleUpdate} />

          {betBoxes.map((id, index) => (
            <BetBox
              key={id}
              id={id}
              balance={balance ?? 0}
              liveMultiplier={liveMultiplier}
              isRunning={isRunning}
              onPlaceBet={handlePlaceBet}
              onCashOut={handleCashOut}
              onCancelBet={handleCancelBet}   // ✅ refund support

              onAdd={index === 0 ? addBetBox : undefined}
              onRemove={index > 0 ? removeBetBox : undefined}
            />
          ))}


          <BetHistory
            onTotalWinChange={setTotalWinUser}
            liveMultiplier={liveMultiplier}
            isRunning={isRunning}
            bets={bets}       // pass the bets state
            setBets={setBets} // pass the setter 
          />
        </ScrollView>
      </View>
    </EarningsProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  adminBtn: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#00b24c",
    borderRadius: 50,
    padding: 14,
    elevation: 4,
  },
});

export default HomeScreen;

//