// src/components/HomeScreen.tsx

import { Pressable } from "react-native";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity, Text } from "react-native";
import Header from "./Header";
import HeaderLogin from "./HeaderLogin";
import BalanceHeader from "./BalanceHeader";
import MultipliersBar from "./MultipliersBar";
import GameBoard from "./GameBoard";
import BetBox from "./BetBox";
import BetHistory, { Bet } from "./BetHistory";
import { useTotalBet } from "../context/BalanceContext";
import { EarningsProvider } from "../context/EarningsContext";
import { useAuth } from "../context/AuthContext";

const HomeScreen: React.FC = () => {
  const [isOpening, setIsOpening] = useState(false);
  const { balance, setBalance } = useTotalBet();
  const [betBoxes, setBetBoxes] = useState<number[]>([Date.now()]);
  const [bets, setBets] = useState<Bet[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [liveMultiplier, setLiveMultiplier] = useState(1);
  const [multipliers, setMultipliers] = useState<string[]>([]);
  const { isLoggedIn, setShowRegister, userName, showRegister } = useAuth();

  // tap anywhere to open register if not logged in
  const handleScreenPress = () => {
    if (!isLoggedIn && !showRegister) {
      setShowRegister(true);
    }
  };

  return (
    <EarningsProvider>
      {/* Wrap entire screen in TouchableOpacity to detect taps */}
      <Pressable onPress={handleScreenPress} style={{ flex: 1, backgroundColor: "#000" }}>


        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 10 }} stickyHeaderIndices={[0]}>
          <Header />

          <BalanceHeader />
          <MultipliersBar multipliers={multipliers} />
          <GameBoard
            bets={bets}
            onUpdate={(val: number, running: boolean) => {
              setLiveMultiplier(val);
              setIsRunning(running);
            }}
            onCrash={(val: number) => {
              setMultipliers((prev) => [val.toFixed(2), ...prev].slice(0, 50));
            }}
          />

          {betBoxes.map((id, index) => (
            <BetBox
              key={id}
              id={id}
              balance={balance ?? 0}
              liveMultiplier={liveMultiplier}
              isRunning={isRunning}
              onPlaceBet={() => { }}
              onCashOut={() => { }}
              onCancelBet={() => { }}
              onAdd={index === 0 && betBoxes.length < 2 ? () => { } : undefined}
              onRemove={index === 1 ? () => { } : undefined}
            />
          ))}

          <BetHistory
            liveMultiplier={liveMultiplier}
            isRunning={isRunning}
            bets={bets}
            setBets={setBets}
          />
        </ScrollView>
      </Pressable>
    </EarningsProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111" },
  welcomeText: {
    color: "#00FF7F",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 8,
    fontWeight: "600",
  },
});

export default HomeScreen;
