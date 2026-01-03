// src/components/BetBox.tsx

import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Switch, TextInput } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import InfoModal from "./InfoModal";
import DepositScreen from "./Deposit/DepositScreen";
import { useTotalBet } from "../context/BalanceContext";

type Props = {
  id: number;
  onAdd?: () => void;
  onRemove?: (id: number) => void;
  balance: number;
  liveMultiplier?: number;
  isRunning?: boolean;
  onPlaceBet?: (amount: number) => void;
  onCashOut?: (amount: number, multiplier: number) => void;
  onCrash?: (val: number) => void;
  onUpdate?: (val: number, isRunning: boolean) => void;
  onPress?: () => void;
  title?: string;
  onCancelBet?: (amount: number) => void;
  openDepositModal?: () => void;
};

const BetBox: React.FC<Props> = ({
  liveMultiplier,
  isRunning,
  onPlaceBet,
  onCashOut,
  id, onAdd, onRemove,
  onPress = () => { },
  onCancelBet,
}) => {
  const [activeTab, setActiveTab] = useState<"Bet" | "Auto">("Bet");

  // 1. New State for the Text Input
  const [amount, setAmount] = useState<number>(100);
  const [inputValue, setInputValue] = useState<string>("100");

  const [hasBet, setHasBet] = useState(false);
  const [queuedNextRound, setQueuedNextRound] = useState(false);
  const { balance } = useTotalBet();

  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [frozenMultiplier, setFrozenMultiplier] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [roundBetPlaced, setRoundBetPlaced] = useState(false);

  // New auto options
  const [autoBet, setAutoBet] = useState(false);
  const [autoCash, setAutoCash] = useState(false);
  const [autoCashMultiplier, setAutoCashMultiplier] = useState("1.00");
  const [depositVisible, setDepositVisible] = useState(false);

  const presets = [100, 200, 500, 1000];

  // Helper to safely update amount AND text (for buttons)
  const updateAmount = (newAmount: number) => {
    const validAmount = Math.max(1, newAmount); // Prevent negative
    setAmount(validAmount);
    setInputValue(validAmount.toString());
  };

  useEffect(() => {
    if (autoBet && !isRunning && !hasBet && !roundBetPlaced) {
      setHasBet(true);
      setRoundBetPlaced(true);
      onPlaceBet?.(amount);
    }
  }, [autoBet, isRunning, hasBet, amount, roundBetPlaced, onPlaceBet]);

  useEffect(() => {
    if (autoCash && hasBet && isRunning && !hasCashedOut) {
      const target = parseFloat(autoCashMultiplier) || 1;
      if ((liveMultiplier || 0) >= target) {
        const currentMultiplier = liveMultiplier || 1;
        setFrozenMultiplier(currentMultiplier);
        onCashOut?.(amount, currentMultiplier);
        setShowModal(true);
        setHasBet(false);
        setHasCashedOut(true);
      }
    }
  }, [autoCash, hasBet, isRunning, liveMultiplier, amount, autoCashMultiplier, onCashOut, hasCashedOut]);

  useEffect(() => {
    if (!isRunning) {
      if (queuedNextRound) {
        setHasBet(true);
        setQueuedNextRound(false);
        onPlaceBet?.(amount);
      } else {
        setHasBet(false);
      }
      setHasCashedOut(false);
      setRoundBetPlaced(false);
    }
  }, [isRunning]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerTabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "Bet" && styles.activeTab]}
            onPress={() => setActiveTab("Bet")}
          >
            <Text style={[styles.tabText, activeTab === "Bet" && styles.activeTabText]}>Bet</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "Auto" && styles.activeTab]}
            onPress={() => setActiveTab("Auto")}
          >
            <Text style={[styles.tabText, activeTab === "Auto" && styles.activeTabText]}>Auto</Text>
          </TouchableOpacity>
        </View>

        {onAdd && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onAdd}
            activeOpacity={0.7}
          >
            {/* Wrapper to hold the stacked boxes */}
            <View style={styles.iconWrapper}>

              {/* The Back Box (Shadow/Background layer) */}
              <View style={styles.backBox} />

              {/* The Front Box (Contains the Plus) */}
              <View style={styles.frontBox}>
                <View style={styles.plusHorizontal} />
                <View style={styles.plusVertical} />
              </View>

            </View>
          </TouchableOpacity>

        )}

        {onRemove && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => onRemove(id)}
            activeOpacity={0.7}
          >
            <View style={styles.minusBox}>
              <View style={styles.minusLine} />
            </View>
          </TouchableOpacity>

        )}
      </View>

      <View style={styles.mainRow}>
        <View style={styles.leftCol}>
          <View style={styles.amountRow}>
            <TouchableOpacity
              style={styles.roundBtn}
              onPress={() => updateAmount(amount - 1)} // Use helper
            >
              <Text style={styles.roundBtnText}>-</Text>
            </TouchableOpacity>

            <View style={styles.amountBox}>
              <TextInput
                style={styles.amountText}
                value={inputValue} // Bind to string state
                keyboardType="decimal-pad"
                onChangeText={(text) => {
                  setInputValue(text); // Allow empty string while typing
                  const parsed = parseFloat(text);
                  if (!isNaN(parsed) && parsed > 0) {
                    setAmount(parsed);
                  } else {
                    // Don't setAmount(0) instantly or it breaks logic, 
                    // just wait for valid input
                  }
                }}
                onBlur={() => {
                  // When user leaves field, format it nicely
                  if (!inputValue || parseFloat(inputValue) === 0) {
                    updateAmount(10); // default fallback
                  } else {
                    setInputValue(amount.toString());
                  }
                }}
              />
            </View>

            <TouchableOpacity
              style={styles.roundBtn}
              onPress={() => updateAmount(amount + 1)} // Use helper
            >
              <Text style={styles.roundBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.presetsContainer}>
            {presets.map((val) => (
              <TouchableOpacity
                key={val}
                style={styles.presetBtn}
                onPress={() => updateAmount(amount + val)} // Use helper
              >
                <Text style={styles.presetText}>{val}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {activeTab === "Auto" && (
            <View style={styles.AutoContainer}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <Text style={{ color: "#fff", fontSize: 10 }}>Auto Bet</Text>
                <View style={styles.switchWrapper}>
                  <Switch
                    value={autoBet}
                    onValueChange={setAutoBet}
                    thumbColor={autoBet ? "#f4f3f4" : "#707070ff"}
                    trackColor={{ false: "#111", true: "#111" }}
                  />
                </View>

                <Text style={{ color: "#fff", fontSize: 10 }}>Auto Cash Out</Text>
                <View style={styles.switchWrapper}>
                  <Switch
                    value={autoCash}
                    onValueChange={setAutoCash}
                    thumbColor={autoCash ? "#f4f3f4" : "#707070ff"}
                    trackColor={{ false: "#111", true: "#111" }}
                  />
                </View>
                {autoCash && (
                  <TextInput
                    style={{
                      backgroundColor: "#222", color: "#fff", borderRadius: 8, height: 35,
                      textAlign: "center", marginTop: 5, paddingHorizontal: 8, fontSize: 10,
                    }}
                    keyboardType="decimal-pad"
                    value={autoCashMultiplier}
                    onChangeText={setAutoCashMultiplier}
                    placeholder="X"
                    placeholderTextColor="#888"
                  />
                )}
              </View>
            </View>
          )}
        </View>

        {depositVisible && (
          <DepositScreen onClose={() => setDepositVisible(false)} />
        )}

        <View style={styles.rightCol}>
          <TouchableOpacity
            style={[
              styles.betBtn,
              !isRunning && !hasBet && { backgroundColor: "#2f960fff" },
              !isRunning && hasBet && { backgroundColor: "#ff0000ff" },
              isRunning && hasBet && !queuedNextRound && { backgroundColor: "#f59032ff" },
              isRunning && queuedNextRound && { backgroundColor: "#ff0000ff" },
              isRunning && !hasBet && !queuedNextRound && { backgroundColor: "#2f960fff" },
            ]}
            onPress={() => {
              if (!balance || balance <= 0) {
                Alert.alert("Hey!", "You don’t have money.", [{ text: "Cancel" }, { text: "Deposit", onPress: () => setDepositVisible(true) }]);
                return;
              }

              if (!isRunning) {
                if (hasBet) {
                  setHasBet(false);
                  setQueuedNextRound(false);
                  onCancelBet?.(amount);
                  return;
                }
                setHasBet(true);
                onPlaceBet?.(amount);
                return;
              }

              if (isRunning && hasBet && !queuedNextRound) {
                const multiplier = liveMultiplier || 1;
                setFrozenMultiplier(multiplier);
                onCashOut?.(amount, multiplier);
                setShowModal(true);
                setHasBet(false);
                return;
              }

              if (isRunning && queuedNextRound) {
                setQueuedNextRound(false);
                setHasBet(false);
                onCancelBet?.(amount);
                return;
              }

              if (isRunning && !hasBet && !queuedNextRound) {
                setQueuedNextRound(true);
              }
            }}
          >
            <Text style={[styles.betBtnText, { fontSize: 20 }]}>
              <View style={{ alignItems: 'center' }}>
                {!isRunning && !hasBet ? (
                  <>
                    <Text style={styles.action}>Bet</Text>
                    <Text style={styles.amount}>{amount.toFixed(2)} INR</Text>
                  </>
                ) : !isRunning && hasBet ? (
                  <Text style={styles.action}>Cancel</Text>
                ) : isRunning && hasBet && !queuedNextRound ? (
                  <>
                    <Text style={styles.action}>Cash Out</Text>
                    <Text style={styles.amount}>{(amount * (liveMultiplier || 1)).toFixed(2)} INR</Text>
                  </>
                ) : isRunning && queuedNextRound ? (
                  <>
                    <Text style={styles.action}>Cancel</Text>
                    <Text style={styles.amount1}>(next round)</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.action}>Bet</Text>
                    <Text style={styles.amount}>{amount.toFixed(2)} INR</Text>
                  </>
                )}
              </View>
            </Text>
          </TouchableOpacity>

          <InfoModal
            visible={showModal}
            onClose={() => {
              setShowModal(false);
              setHasBet(false);
              setHasCashedOut(false);
            }}
            betAmount={amount}
            frozenMultiplier={frozenMultiplier}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  action: { fontSize: 20, color: '#ddd', fontFamily: "Barlow-Medium" },
  amount: { color: '#ddd', fontSize: 20 },
  switchWrapper: { width: 50, marginTop: 10, borderRadius: 50, backgroundColor: "#111", justifyContent: "center" },
  amount1: { color: '#ddd', fontSize: 15 },
  container: { padding: 8, backgroundColor: "#1B1C1E", borderRadius: 12, marginHorizontal: 5, marginTop: 5 },
  AutoContainer: { paddingHorizontal: 12, borderWidth: 0.5, borderTopColor: "#000", width: 330, marginTop: 10, borderColor: "#1B1C1E" },
  headerRow: { flexDirection: "row", marginBottom: 7 },
  headerTabs: { flexDirection: "row", marginLeft: 70, height: 30, backgroundColor: "#111", borderRadius: 20, padding: 4 },
  tab: { paddingVertical: 1, paddingHorizontal: 35, borderRadius: 16 },
  activeTab: { backgroundColor: "#2C2C2E", paddingVertical: 1, paddingHorizontal: 40 },
  tabText: { color: "#636363", fontSize: 11, marginTop: 2 },
  activeTabText: { color: "#fff" },
  iconButton: { padding: 7, marginLeft: 30, width: 25, height: 25, borderRadius: 50, backgroundColor: "#4e4e4e", justifyContent: "center", alignItems: "center" },

  mainRow: { flexDirection: "row", backgroundColor: "#1B1C1E" },
  leftCol: { flex: 1, marginRight: 10 },
  rightCol: { width: 175, justifyContent: "flex-start" },
  amountRow: { flexDirection: "row", alignItems: "center", marginBottom: 5, backgroundColor: "#111", borderRadius: 16, height: 30 },
  roundBtn: { width: 23, height: 23, backgroundColor: "#222", marginHorizontal: 4, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  roundBtnText: { color: "#fff", fontSize: 14 },
  amountBox: { flex: 1, borderRadius: 8, alignItems: "center" },
  amountText: { color: "#fff", marginTop: -2, fontSize: 12, width: '100%', textAlign: 'center' },
  presetsContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  presetBtn: { width: "48%", backgroundColor: "#111", borderRadius: 15, height: 20, alignItems: "center", marginBottom: 4 },
  presetText: { color: "#6d6c6c", fontSize: 12 },
  betBtn: { borderRadius: 8, width: 170, height: 85, borderColor: "#fff", borderWidth: 0.5, alignItems: "center", justifyContent: "center" },
  betBtnText: { color: "#ffffffda", textAlign: "center", fontSize: 20, lineHeight: 16 },
  minusBox: {
    width: 17,
    height: 13,
    borderWidth: 1.5,
    borderColor: '#bbbbbbff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3, // optional (slightly rounded)
  },

  minusLine: {
    width: 8,
    height: 1.5,
    backgroundColor: '#bbbbbbff',
    borderRadius: 2,
  },


  backBox: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 14,
    height: 10,
    borderWidth: 1.5,
    borderColor: '#00f700b4',
    borderRadius: 2,
  },



  frontBox: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 10,
    borderWidth: 1.5,
    borderColor: '#00f700b4',
    borderRadius: 2,
    backgroundColor: '#4e4e4e', 
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },

  iconWrapper: {
    width: 18,
    height: 14,
    position: 'relative', // Needed for absolute positioning children
  },

  plusVertical: {
    width: 1.5,
    height: 6,
    backgroundColor: '#00f700b4',
    borderRadius: 1,
    position: 'absolute',
  },

  plusHorizontal: {
    width: 6,
    height: 1.5,
    backgroundColor: '#00f700b4',
    borderRadius: 1,
    position: 'absolute', // Ensures perfect center with vertical
  },

});

export default BetBox;