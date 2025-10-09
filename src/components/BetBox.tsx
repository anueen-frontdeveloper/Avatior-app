import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Switch, TextInput } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import InfoModal from "./InfoModal";
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
  balance,
  onUpdate,
  onPress = () => { },
  title = "Bet",
  onCancelBet,
}) => {
  const [activeTab, setActiveTab] = useState<"Bet" | "Auto">("Bet");
  const [amount, setAmount] = useState<number>(100);
  const [hasBet, setHasBet] = useState(false);
  const [queuedNextRound, setQueuedNextRound] = useState(false);

  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [frozenMultiplier, setFrozenMultiplier] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [roundBetPlaced, setRoundBetPlaced] = useState(false);
  const [hasQueuedBet, setHasQueuedBet] = useState(false);
  const [hasActiveBet, setHasActiveBet] = useState(false);

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
  const handleBetPress = () => {
    if (balance < 20) {
      setDepositVisible(true); // open Deposit Modal
      return;
    }

    if (!hasBet && !isRunning) {
      setHasBet(true);
      onPlaceBet?.(amount);
    } else if (isRunning && hasBet && !hasCashedOut) {
      const multiplier = liveMultiplier || 1;
      setFrozenMultiplier(multiplier);
      onCashOut?.(amount, multiplier);
      setShowModal(true);
      setHasBet(false);
      setHasCashedOut(false);
    } else if (hasBet && !isRunning) {
      setHasBet(false);
      onCashOut?.(amount, 1);
    }
  };


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
            <MaterialCommunityIcons name="layers-plus" size={22} color="#00f700b4" />
          </TouchableOpacity>
        )}

        {onRemove && (
          <TouchableOpacity style={styles.iconButton} onPress={() => onRemove(id)}>
            <MaterialCommunityIcons name="layers-remove" size={22} color="#ff4444" />
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
                style={[styles.amountText, { textAlign: "center" }]}
                value={amount.toString()}
                keyboardType="decimal-pad"
                onChangeText={(text) => {
                  // Convert input to number, default to 0 if invalid
                  const parsed = parseFloat(text);
                  if (!isNaN(parsed)) {
                    setAmount(parsed);
                  } else {
                    setAmount(0);
                  }
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
          <View style={styles.AutoContainer}>
            {activeTab === "Auto" && (

              <>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <Text style={{ color: "#fff", fontFamily: "", fontSize: 10 }}>Auto Bet</Text>
                  <View style={styles.switchWrapper}>
                    <Switch
                      value={autoBet}
                      onValueChange={setAutoBet}
                      thumbColor={autoBet ? "#3CB01F" : "#f4f3f4"}
                      trackColor={{ false: "#111", true: "#111" }} // this controls the track colors
                    />
                  </View>

                  <Text style={{ color: "#fff", fontFamily: "", fontSize: 10 }}>Auto Cash Out</Text>
                  <View style={styles.switchWrapper}>
                    <Switch
                      value={autoCash}
                      onValueChange={setAutoCash}
                      thumbColor={autoCash ? "#3CB01F" : "#f4f3f4"}
                      trackColor={{ false: "#111", true: "#111" }} // this controls the track colors
                    />
                  </View>
                  {autoCash && (
                    <TextInput
                      style={{
                        backgroundColor: "#222",
                        color: "#fff",
                        borderRadius: 8,
                        padding: 8,
                        textAlign: "center",
                        fontWeight: "500",
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
            )}
          </View>
        </View>

        {/* Right column */}
        <View style={styles.rightCol}>
          <TouchableOpacity
            style={[
              styles.betBtn,
              !isRunning && !hasBet && { backgroundColor: "#3CB01F" }, // 🟩 ready
              !isRunning && hasBet && { backgroundColor: "#ff0000ff" }, // 🔴 cancel pre‑round
              isRunning && hasBet && !queuedNextRound && { backgroundColor: "#f59032ff" }, // 🟠 active
              isRunning && queuedNextRound && { backgroundColor: "#ff0000ff" }, // 🔴 queued next
              isRunning && !hasBet && !queuedNextRound && { backgroundColor: "#3CB01F" }, // 🟩 idle mid‑round
            ]}
            onPress={() => {
              // Pre‑round
              if (!isRunning) {
                if (!hasBet) {
                  // place queued bet
                  setHasBet(true);
                  onPlaceBet?.(amount);
                } else {
                  // cancel pre‑round bet
                  setHasBet(false);
                  setQueuedNextRound(false);   // 🧹 add this line
                  onCancelBet?.(amount);
                }
                return;
              }

              // Live game
              if (isRunning && hasBet && !queuedNextRound) {
                // active bet → cash out
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
            <Text style={styles.betBtnText}>
              {!isRunning && !hasBet
                ? `Bet ${amount} INR`
                : !isRunning && hasBet
                  ? `Cancel`
                  : isRunning && hasBet && !queuedNextRound
                    ? `Cash Out ${(amount * (liveMultiplier || 1)).toFixed(2)} INR`
                    : isRunning && queuedNextRound
                      ? `Cancel\n(wait for next round)`
                      : `Bet ${amount} INR`}
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

  switchWrapper: {
    height: 30,               // container height
    width: 45,                // container width
    borderRadius: 50,
    backgroundColor: "#111", // your custom background
    justifyContent: "center",
    marginHorizontal: 12,
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
    padding: 12,
    backgroundColor: "#1B1C1E",
    borderColor: "#1B1C1E",
    marginHorizontal: 5,
    borderRadius: 12,
    marginTop: 5,
  },
  /* Header */
  headerRow: { flexDirection: "row", marginBottom: 7 },
  headerTabs: {
    flexDirection: "row",
    marginLeft: 82,
    backgroundColor: "#111",
    borderRadius: 20,
    padding: 4,
  },
  tab: {
    paddingVertical: 2,
    paddingHorizontal: 30,
    borderRadius: 16,
  },
  switch: { height: 20, backgroundColor: "#89a6e0ff", borderRadius: 50, },

  iconButton: {
    marginLeft: 30,
    borderColor: "#161616ff",
    borderWidth: 4,
    borderRadius: 50,
    padding: 1,
    backgroundColor: "#4e4e4eff"
  }
  ,
  activeTab: { backgroundColor: "#2C2C2E" },
  tabText: { color: "#888", fontWeight: "500" },
  activeTabText: { color: "#fff", fontWeight: "700" },

  /* Main layout */
  mainRow: { flexDirection: "row" },
  leftCol: { flex: 1, marginRight: 10 },
  rightCol: { width: 175, justifyContent: "flex-start" },

  /* Amount row */
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    backgroundColor: "#111",
    borderRadius: 16,
    height: 35,
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
  roundBtnText: { color: "#fff", fontSize: 14, fontWeight: "200" },
  amountBox: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 1,
    alignItems: "center",

  },
  amountText: { color: "#fff", fontSize: 10, fontWeight: "300" },

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
    alignItems: "center",
    marginBottom: 4,
  },
  presetText: { color: "#6d6c6cff", fontFamily: "Barlow-Bold", },

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
    backgroundColor: "#3CB01F",
    borderRadius: 8,
    width: 150,
    height: 85,
    borderColor: "#fff",
    borderWidth: 0.5,
    alignItems: "center",     // centers children horizontally
    justifyContent: "center", // centers children vertically
  },
  betBtnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 12,
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
