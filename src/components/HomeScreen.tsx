// src/components/HomeScreen.tsx
import React, { useState, useEffect } from "react"; import { ScrollView, StyleSheet, View, TouchableOpacity } from "react-native";
import Header from "./Header";
import BalanceHeader from "./BalanceHeader";
import MultipliersBar from "./MultipliersBar";
import GameBoard from "./GameBoard";
import BetBox from "./BetBox";
import BetHistory, { Bet } from "./BetHistory";
import { calculatePayout } from "../utils/system";
import {
  useTotalBet,
} from "../context/totalbetcontext";



function getWeightedMultiplier() {
  const roll = Math.random() * 100; // 0–100

  if (roll < 110) {
    // 40% chance
    return `${(Math.random() * (5 - 1) + 1).toFixed(2)}x`;
  } else if (roll < 70) {
    // 30% chance
    return `${(Math.random() * (10 - 5) + 5).toFixed(2)}x`;
  } else if (roll < 90) {
    // 20% chance
    return `${(Math.random() * (15 - 10) + 10).toFixed(2)}x`;
  } else if (roll < 100) {
    // 10% chance
    return `${(Math.random() * (30 - 15) + 15).toFixed(2)}x`;
  } else if (roll < 105) {
    // 5% chance
    return `${(Math.random() * (100 - 30) + 30).toFixed(2)}x`;
  } else {
    // 0.5% chance
    return `${(Math.random() * (1000 - 100) + 100).toFixed(2)}x`;
  }
}


const HomeScreen: React.FC = () => {
  const { balance, setBalance } = useTotalBet();
  const [depositVisible, setDepositVisible] = useState(false);
  const [betBoxes, setBetBoxes] = useState<number[]>([Date.now()]);
  const [systemEarning, setSystemEarning] = useState(0);
  const [systemVisible, setSystemVisible] = useState(false);
  const [totalWinUser, setTotalWinUser] = useState(0);

  const [multipliers, setMultipliers] = useState<string[]>(
    Array.from({ length: 6 }, () => getWeightedMultiplier())
  );

  const [bets, setBets] = useState<Bet[]>([]);  // ✅ explicitly type state
  const [isRunning, setIsRunning] = useState(false);
  const [liveMultiplier, setLiveMultiplier] = useState(1);

  // --- Game events --------------------------------------------------------
  const handleCrash = (val: number) => {
    setMultipliers((prev) => [`${val.toFixed(2)}x`, ...prev].slice(0, 20));
  };

  const handleUpdate = (val: number, running: boolean) => {
    setLiveMultiplier(val);
    setIsRunning(running);
  };

  // --- Betting ------------------------------------------------------------
  const handlePlaceBet = (amount: number) => {
    if (balance >= amount) {
      setBalance((prev: number) => prev - amount);

      setBets(prev =>
        prev.map(b =>
          b.user === "You"
            ? { ...b, bet: amount, isVisible: true }
            : b
        )
      );
    }
  };

  /** Split payout – user 70 % / system 30 % */
  const handleCashOut = (amount: number, multiplier: number) => {
    const { userGain, systemGain } = calculatePayout(amount, multiplier);

    setBalance((prev: number) => prev + userGain); // 70 % to player
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

  // 🟢 Start first round automatically when app loads
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
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 10 }}
        stickyHeaderIndices={[0]}
        nestedScrollEnabled={true}
      >

        <Header balance={balance} />
        <BalanceHeader />
        <MultipliersBar multipliers={multipliers} />
        <GameBoard onCrash={handleCrash} onUpdate={handleUpdate} />

        {betBoxes.map((id, index) => (
          <BetBox
            key={id}
            id={id}
            balance={balance}
            liveMultiplier={liveMultiplier}
            isRunning={isRunning}
            onPlaceBet={handlePlaceBet}
            onCashOut={handleCashOut}
            onAdd={index === 0 ? addBetBox : undefined}
            onRemove={index > 0 ? removeBetBox : undefined}
            openDepositModal={() => setDepositVisible(true)}
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