// src/components/BetBox.tsx

import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Switch, TextInput } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import InfoModal from "./InfoModal";
import DepositModal from "./Deposit/DepositModal";
import { useTotalBet } from "../context/BalanceContext";
import DepositScreen from "./Deposit/DepositScreen";

type Props = {
  id: number;
  onAdd?: () => void;
  onRemove?: (id: number) => void;
  balance: number;  // <-- add balance

  liveMultiplier?: number;
  isRunning?: boolean;
  onPlaceBet?: (amount: number) => void;
  onCashOut?: (amount: number, multiplier: number) => void; onCrash?: (val: number) => void;
  onUpdate?: (val: number, isRunning: boolean) => void;
  onPress?: () => void; // <-- added
  title?: string;       // <-- added
  onCancelBet?: (amount: number) => void;
  openDepositModal?: () => void; // <-- optional deposit modal

};



const BetBox: React.FC<Props> = ({
  liveMultiplier,
  isRunning,
  onPlaceBet,
  onCashOut,
  onCrash,
  id, onAdd, onRemove,
  onUpdate,
  onPress = () => { },
  title = "Bet",
  onCancelBet,
}) => {
  const [activeTab, setActiveTab] = useState<"Bet" | "Auto">("Bet");
  const [amount, setAmount] = useState<number>(100);
  const [hasBet, setHasBet] = useState(false);
  const [queuedNextRound, setQueuedNextRound] = useState(false);
  const { balance } = useTotalBet();
  const [betBoxes, setBetBoxes] = useState([1]); // start with 1 box

  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [frozenMultiplier, setFrozenMultiplier] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [roundBetPlaced, setRoundBetPlaced] = useState(false);
  const [hasQueuedBet, setHasQueuedBet] = useState(false);
  const [hasActiveBet, setHasActiveBet] = useState(false);
  const pressLock = useRef(false);

  const [toggleText, setToggleText] = useState(true); // true = Bet, false = Cancel

  // New auto options
  const [autoBet, setAutoBet] = useState(false);
  const [autoCash, setAutoCash] = useState(false);
  const [autoCashMultiplier, setAutoCashMultiplier] = useState("1.00");
  const [isAdded, setIsAdded] = useState(true); // start as added
  const [showModal, setShowModal] = useState(false);
  const [depositVisible, setDepositVisible] = useState(false);

  const presets = [100, 200, 500, 1000];

  useEffect(() => {
    if (autoBet && !isRunning && !hasBet && !roundBetPlaced) {
      setHasBet(true);
      setRoundBetPlaced(true); // mark this round as placed
      onPlaceBet?.(amount);
    }
  }, [autoBet, isRunning, hasBet, amount, roundBetPlaced, onPlaceBet]);



  useEffect(() => {
    if (autoCash && hasBet && isRunning && !hasCashedOut) {
      const target = parseFloat(autoCashMultiplier) || 1;
      if ((liveMultiplier || 0) >= target) {
        const currentMultiplier = liveMultiplier || 1;  // ✅ define it here
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
      setHasBet(false);
      setHasCashedOut(false);
      setRoundBetPlaced(false); // reset for next round
    }
  }, [isRunning]);
  useEffect(() => {
    if (!isRunning) {
      // new round about to start – queued bets become active
      if (queuedNextRound) {
        setHasBet(true);
        setQueuedNextRound(false);
      } else {
        setHasBet(false);
      }
    }
  }, [isRunning]);



  return (
    <View style={styles.container}>
      {/* Header (Bet | Auto) */}
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
          <TouchableOpacity style={styles.iconButton} onPress={onAdd}>
            <MaterialCommunityIcons name="layers-plus" size={19} color="#00f700b4" />
          </TouchableOpacity>
        )}

        {onRemove && (
          <TouchableOpacity style={styles.iconButton} onPress={() => onRemove(id)}>
            <MaterialCommunityIcons name="inbox-remove" size={19} color="#dfdfdfff" />
          </TouchableOpacity>
        )}


      </View>

      {/* Main row for Bet: left column + right column */}
      <View style={styles.mainRow}>
        {/* Left column */}
        <View style={styles.leftCol}>
          {/* + [amount] - */}
          <View style={styles.amountRow}>
            <TouchableOpacity
              style={styles.roundBtn}
              onPress={() => setAmount(a => Math.max(1, a - 1))}            >
              <Text style={styles.roundBtnText}>-</Text>
            </TouchableOpacity>

            <View style={styles.amountBox}>
              <TextInput
                style={styles.amountText}
                value={amount.toString()}
                keyboardType="decimal-pad"
                onChangeText={(text) => {
                  const parsed = parseFloat(text);
                  setAmount(!isNaN(parsed) ? parsed : 0);
                }}
              />
            </View>


            <TouchableOpacity
              style={styles.roundBtn}
              onPress={() => setAmount(a => Math.max(1, a + 1))}
            >
              <Text style={styles.roundBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Presets 2x2 */}
          <View style={styles.presetsContainer}>
            {presets.map((val) => (
              <TouchableOpacity
                key={val}
                style={styles.presetBtn}
                onPress={() => setAmount(currentAmount => currentAmount + val)}              >
                <Text style={styles.presetText}>{val}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {activeTab === "Auto" && (
            <View style={styles.AutoContainer}>

              <>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <Text style={{ color: "#fff", fontFamily: "", fontSize: 10 }}>Auto Bet</Text>
                  <View style={styles.switchWrapper}>
                    <Switch
                      value={autoBet}
                      onValueChange={setAutoBet}
                      thumbColor={autoBet ? "#f4f3f4" : "#707070ff"}
                      trackColor={{ false: "#111", true: "#111" }} // this controls the track colors
                    />
                  </View>

                  <Text style={{ color: "#fff", fontFamily: "", fontSize: 10 }}>Auto Cash Out</Text>
                  <View style={styles.switchWrapper}>
                    <Switch
                      value={autoCash}
                      onValueChange={setAutoCash}
                      thumbColor={autoCash ? "#f4f3f4" : "#707070ff"}
                      trackColor={{ false: "#111", true: "#111" }} // this controls the track colors
                    />
                  </View>
                  {autoCash && (
                    <TextInput
                      style={{
                        backgroundColor: "#222",
                        color: "#fff",
                        borderRadius: 8,
                        height: 35,
                        textAlign: "center",
                        fontFamily: "ZalandoSansSemiExpanded-Mediums",
                        marginTop: 5,

                        paddingHorizontal: 8,
                        fontSize: 10,
                      }}
                      keyboardType="decimal-pad"
                      value={autoCashMultiplier}
                      onChangeText={setAutoCashMultiplier}
                      placeholder="Cash Out Multiplier"
                      placeholderTextColor="#888"
                    />
                  )}
                </View>


              </>
            </View>
          )}
        </View>

        {depositVisible && (
          <DepositScreen
            onClose={() => {
              setDepositVisible(false);
            }}
          />
        )}
        {/* Right column */}
        <View style={styles.rightCol}>
          <TouchableOpacity
            style={[
              styles.betBtn,
              !isRunning && !hasBet && { backgroundColor: "#39b613ff" }, // 🟩 ready
              !isRunning && hasBet && { backgroundColor: "#ff0000ff" }, // 🔴 cancel pre‑round
              isRunning && hasBet && !queuedNextRound && { backgroundColor: "#f59032ff" }, // 🟠 active
              isRunning && queuedNextRound && { backgroundColor: "#ff0000ff" }, // 🔴 queued next
              isRunning && !hasBet && !queuedNextRound && { backgroundColor: "#39b613ff" }, // 🟩 idle mid‑round
            ]}
            onPress={() => {
              if (!balance || balance <= 0) {
                Alert.alert(
                  "Hey!",
                  "You don’t have money. Would you like to deposit now?",
                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "Deposit",
                      onPress: () => setDepositVisible(true),
                    },
                  ]
                );
                return;
              }


              // Pre‑round
              if (!isRunning) {
                // guard against rapid tapping before state updates
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
                // cancel queued (the red “wait for next round”)
                setQueuedNextRound(false);
                setHasBet(false);               // 🧹 ensure fully cleared
                onCancelBet?.(amount);
                return;
              }

              // Too late ‑ queue for next round
              if (isRunning && !hasBet && !queuedNextRound) {
                setQueuedNextRound(true);
              }
            }}
          >
            <Text
              style={[
                styles.betBtnText,
                (!isRunning && !hasBet) || (isRunning && !hasBet && !queuedNextRound)
                  ? { fontSize: 19 } // Bet state
                  : (isRunning && hasBet && !queuedNextRound)
                    ? { fontSize: 20 } // Cash Out state
                    : { fontSize: 13 }, // Cancel states
              ]}
            >
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
                    <Text style={styles.amount}>
                      {(amount * (liveMultiplier || 1)).toFixed(2)} INR
                    </Text>
                  </>
                ) : isRunning && queuedNextRound ? (
                  <>
                    <Text style={styles.action}>Cancel</Text>
                    <Text style={styles.amount}>(wait for next round)</Text>
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

              // Reset after modal closes
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
  action: {
    fontSize: 20,
    color: '#ddd',
    fontFamily: "Barlow-Medium"
  },
  amount: {
    fontSize: 20,
    color: '#ddd',
  },
  switchWrapper: {
    width: 50,                // container width
    marginTop: 10,
    borderRadius: 50,
    backgroundColor: "#111", // your custom background
    justifyContent: "center",
  },
  container: {
    padding: 8,
    backgroundColor: "#1B1C1E",
    borderColor: "#1B1C1E",
    borderRadius: 12,
    marginHorizontal: 5,
    marginTop: 5,
  },
  AutoContainer: {
    paddingHorizontal: 12,
    marginHorizontal: 0,
    borderWidth: 0.5,
    borderTopColor: "#000000ff",
    width: 330,
    marginTop: 10,
    borderColor: "#1B1C1E",
  },
  /* Header */
  headerRow: { flexDirection: "row", marginBottom: 7 },
  headerTabs: {
    flexDirection: "row",
    marginLeft: 70,
    height: 30,
    backgroundColor: "#111",
    borderRadius: 20,
    padding: 4,
  },
  tab: {
    paddingVertical: 1,
    paddingHorizontal: 35,
    borderRadius: 16,
  },
  switch: { height: 20, backgroundColor: "#89a6e0ff", borderRadius: 50, },

  iconButton: {
    marginLeft: 30,
    width: 25,
    height: 25,
    borderRadius: 50,
    backgroundColor: "#4e4e4eff",
    justifyContent: "center",
    alignItems: "center",
  }

  ,
  activeTab: {
    backgroundColor: "#2C2C2E", paddingVertical: 1, paddingHorizontal: 40
  },
  tabText: { color: "#636363ff", fontFamily: "Roboto-VariableFont_wdth,wght", fontSize: 11, marginTop: 2 },
  activeTabText: { color: "#fff", fontFamily: "Roboto-VariableFont_wdth,wght", },

  /* Main layout */
  mainRow: { flexDirection: "row", backgroundColor: "#1B1C1E", },
  leftCol: { flex: 1, marginRight: 10 },
  rightCol: { width: 175, justifyContent: "flex-start" },

  /* Amount row */
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    backgroundColor: "#111",
    borderRadius: 16,
    height: 30,
  },
  roundBtn: {
    width: 23,
    height: 23,
    backgroundColor: "#222",
    marginHorizontal: 4,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  roundBtnText: { color: "#fff", fontSize: 14, fontFamily: "ZalandoSansSemiExpanded-Mediums" },
  amountBox: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: -2,
    alignItems: "center",
  },
  amountText: { color: "#fff", marginTop: -5, fontSize: 10, fontFamily: "ZalandoSansSemiExpanded-Mediums" },

  /* Presets grid */
  presetsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  presetBtn: {
    width: "48%",
    backgroundColor: "#111",
    borderRadius: 15,
    height: 20,
    alignItems: "center",
    marginBottom: 4,
  },
  presetText: { color: "#6d6c6cff", fontSize: 12, fontFamily: "ZalandoSansSemiExpanded-Mediums" },

  /* Right column */
  betBtnSubText: {
    color: "#ddd",
    fontSize: 12,
    fontWeight: "500",
    fontFamily: "Barlow-Regular",
    textAlign: "center",
    marginTop: 2,
  },
  betBtn: {
    borderRadius: 8,
    width: 170,
    height: 85,
    borderColor: "#fff",
    borderWidth: 0.5,
    alignItems: "center",     // centers children horizontally
    justifyContent: "center", // centers children vertically
  },
  betBtnText: {
    color: "#ffffffda",
    textAlign: "center",
    fontFamily: "Montserrat-Regular",
    fontSize: 20,
    lineHeight: 16,
  },

  currencyBox: {
    backgroundColor: "#111",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  currencyText: { color: "#fff", fontWeight: "700" },
});

export default BetBox;
