
import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity, Text, Modal, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

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
  const { balance } = useTotalBet();
  const [betBoxes, setBetBoxes] = useState<number[]>([Date.now()]);
  const [bets, setBets] = useState<Bet[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [liveMultiplier, setLiveMultiplier] = useState(1);
  const [multipliers, setMultipliers] = useState<string[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const { isLoggedIn, setShowRegister } = useAuth();

  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      setShowWelcome(true);

      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]);

  const handleGuestClick = () => {
    setShowRegister(true);
  };

  return (
    <EarningsProvider>
      <View style={styles.mainWrapper}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 10 }}
          stickyHeaderIndices={[0]}
          scrollEnabled={!isPanelOpen}   // ⬅️ THIS IS THE KEY

        >
          {isLoggedIn ? <Header /> : <HeaderLogin />}

          <View style={styles.gameContent}>
            <BalanceHeader onPanelToggle={setIsPanelOpen}/>
            <MultipliersBar multipliers={multipliers} />
            <GameBoard
              bets={bets}
              onUpdate={(val, running) => {
                setLiveMultiplier(val);
                setIsRunning(running);
              }}
              onCrash={(val) => {
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
                onAdd={index === 0 && betBoxes.length < 2 ? () => {
                  setBetBoxes(prev => [...prev, prev.length + 1]);
                } : undefined}
                onRemove={index === 1 ? () => {
                  setBetBoxes(prev => prev.filter((_, i) => i !== index));
                } : undefined}
              />
            ))}

            <BetHistory
              liveMultiplier={liveMultiplier}
              isRunning={isRunning}
              bets={bets}
              setBets={setBets}
            />

            {!isLoggedIn && (
              <TouchableOpacity
                style={styles.guestBlocker}
                activeOpacity={1}
                onPress={handleGuestClick}
              />
            )}
          </View>
        </ScrollView>

        <Modal visible={showWelcome} transparent animationType="fade">
          <View style={styles.welcomeOverlay}>
            <View style={styles.welcomeBox}>
              <View style={styles.iconCircle}>
                <Ionicons name="checkmark" size={40} color="#fff" />
              </View>
              <Text style={styles.welcomeTitle}>Welcome!</Text>
              <Text style={styles.welcomeSub}>You have successfully logged in.</Text>
            </View>
          </View>
        </Modal>

      </View>
    </EarningsProvider>
  );
};

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: "#000" },
  container: { flex: 1, backgroundColor: "#111" },
  gameContent: { position: 'relative' },
  guestBlocker: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 9999, backgroundColor: "transparent",
  },

  welcomeOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeBox: {
    width: 280,
    backgroundColor: "#191919",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    elevation: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#00C853",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  welcomeTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  welcomeSub: {
    color: "#888",
    fontSize: 14,
    textAlign: "center",
  },
});

export default HomeScreen;