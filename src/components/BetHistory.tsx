// src/components/BetHistory.tsx

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from "react-native";
import { useEarnings } from "../context/EarningsContext";
import { getCrashPoint } from "../utils/getCrashPoint";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";


// Types
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
  didLose?: boolean;  // <-- new field
  date?: string; // 👈 add this

};
export type CrashOptions = {
  totalBetAmount: number;
  cashouttotal: number;
};

type BetHistoryProps = {
  liveMultiplier: number;
  isRunning: boolean;
  bets: Bet[];
  onTotalWinChange?: (total: number) => void;
  setBets: React.Dispatch<React.SetStateAction<Bet[]>>;
};

const BetHistory: React.FC<BetHistoryProps> = ({
  liveMultiplier,
  isRunning,
  bets,
  setBets,
  onTotalWinChange,
}) => {
  const { totalEarnings, addEarnings, updateTotals, totalBetAmount, withdrawCash } = useEarnings();
  const [activeTab, setActiveTab] = useState<"All Bets" | "Previous" | "Top">(
    "All Bets"
  );
  const [totalBetAmountState, setTotalBetAmountState] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [lostBets, setLostBets] = useState<Bet[]>([]);
  const [filter, setFilter] = useState("X");
  const [period, setPeriod] = useState("Day");
  const crash = getCrashPoint({
    totalBetAmount: totalBetAmount,
    cashouttotal: withdrawCash,


  });
  const visibleBets = bets.filter(b => b.isVisible !== false);
  const [totalWin, setTotalWin] = useState(0);
  const userHasBet = totalBetAmount > 0;
  // 🔹 1️⃣ Crxeate new fake players ONLY during wait phase
  useEffect(() => {
    if (!isRunning) {   // means currently waiting
      const randomBets: Bet[] = Array.from({ length: 9 }).map((_, i) => ({
        id: `user${i}`,
        user: `User${Math.floor(Math.random() * 1000)}`,
        bet: 100,
        multiplierTarget: parseFloat((Math.random() * 3 + 1).toFixed(2)),
        avatar: `https://i.pravatar.cc/40?img=${i + 1}`,
        cashout: undefined,
        multiplier: undefined,
        isVisible: true,
      }));

      // Include your "You"
      setBets(prev => {
        const mine = prev.find(p => p.isMine) || {
          id: "you",
          user: "You",
          bet: 100,
          isMine: true,
          avatar: "https://i.pravatar.cc/40?img=0",
        };
        const all = [mine, ...randomBets];
        const newTotalBet = all.reduce((sum, b) => sum + b.bet, 0);
        updateTotals(all);
        setTotalBetAmountState(newTotalBet);
        console.log("✅ Fixed Total Bet Amount:", newTotalBet);
        return all;
      });
    }
  }, [isRunning]);

  useEffect(() => {
    const betTotal = totalBetAmountState;
    const cashoutTotal = withdrawCash || 0;
    const system = betTotal - cashoutTotal;
    //check user bet on it than this logic works 
    // fly upto 100x 
    //we have to show the users that u earn upto 100x if we show them that u earn only 2x or own logic then he will not interested.
    //so show him 100x but when he bet on it, then implement our 70%-30% logic 
    console.log("========== SYSTEM SUMMARY ==========");
    console.log("Total Bet Amount:", betTotal);
    console.log("Cashout Total:", cashoutTotal);
    console.log("System Earnings (net):", system);
    console.log("====================================");
  }, [totalBetAmountState, withdrawCash]);

  // use if else 
  //if they bet 
  // 70 - 30
  //else 
  // 100x

  useEffect(() => {
    if (isRunning) return;
    updateTotals(bets);
  }, [isRunning]);

  useEffect(() => {
    if (isRunning) return;

    const myBet = bets.find(b => b.isMine);
    if (!myBet) return;

    if (myBet.cashout !== undefined) {
      const profit = myBet.cashout - myBet.bet;
      if (profit > 0) {
        addEarnings(profit);
      }
    }
  }, [bets, isRunning]);



  useEffect(() => {
    if (isRunning) return;
    setBets(prev =>
      prev.map(b => {
        if (!b.isMine && b.cashout === undefined) {
          return { ...b, didLose: true };
        }
        return b;
      })
    );
  }, [isRunning]);



  useEffect(() => {
    const losers = bets.filter(b => b.didLose);
    if (losers.length > 0) {
      setLostBets(losers);
      setShowModal(true);
    }
  }, [bets]);

  // Auto cashout simulation (only a few users)
  useEffect(() => {
    if (!isRunning) return;

    bets.forEach(b => {
      if (b.isMine || b.cashout !== undefined) return;

      const willCashout = Math.random() < 0.8;

      if (willCashout && b.multiplierTarget && liveMultiplier >= b.multiplierTarget) {
        const delay = Math.random() * 300; // short random delay for realism
        setTimeout(() => {
          setBets(prev =>
            prev.map(p =>
              p.id === b.id
                ? {
                  ...p,
                  multiplier: b.multiplierTarget,
                  cashout: p.bet * b.multiplierTarget!,
                }
                : p
            )
          );
        }, delay);
      }
    });
  }, [liveMultiplier, isRunning]);




  useEffect(() => {
    if (isRunning) {
      setBets(prev => prev.map(b =>
        b.isMine
          ? { ...b, cashout: undefined, multiplier: undefined, isVisible: true }
          : { ...b, cashout: undefined, multiplier: undefined }
      ));
    }
  }, [isRunning]);



  useEffect(() => {
    const sum = bets.reduce((acc, b) => acc + (b.cashout || 0), 0);
    setTotalWin(sum);
  }, [bets]);

  // Render bet row
  const renderBet = ({ item }: { item: Bet }) => {
    const bgColor = item.cashout !== undefined ? "#1F320D" : "#101112";
    {

    }

    return (
      <View style={[styles.row, { backgroundColor: bgColor }]}>
        {/* Player info */}
        <View style={styles.playerCell}>
          <Image
            source={{ uri: item.avatar }}
            style={styles.avatar}
          />

          <Text style={styles.cell}>{item.user}</Text>
        </View>

        {/* Bet, Multiplier, Win */}
        <Text style={styles.betCell}>{item.bet.toFixed(2)}</Text>
        <Text style={styles.multCell}>
          {item.multiplier !== undefined ? `${item.multiplier.toFixed(2)}x` : ` `}
        </Text>
        <Text style={styles.cashCell}>
          {item.cashout !== undefined ? item.cashout.toFixed(2) : " "}
        </Text>

      </View>
    );
  };



  return (
    <View style={styles.container}>
      {/* Top Tabs */}
      <View style={styles.tabRow}>
        {["All Bets", "Previous", "Top"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab as any)}
          >
            <Text
              style={[styles.tabText, activeTab === tab && styles.activeTabText]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* All Bets */}
      {activeTab === "All Bets" && (
        <View style={{ flex: 1 }}>
          {/* Info Box */}
          {/* Info Box */}
          <View style={styles.infoBox}>
            {/* Top row */}
            <View style={styles.infoRow}>
              {/* Left side (avatars + counter) */}
              <View style={styles.infoBoxLeft}>
                <View style={styles.avatars}>
                  <Image source={{ uri: "https://i.pravatar.cc/50?img=1" }} style={styles.avatar} />
                  <Image source={{ uri: "https://i.pravatar.cc/50?img=3" }} style={styles.avatar} />
                  <Image source={{ uri: "https://i.pravatar.cc/50?img=2" }} style={styles.avatar} />
                </View>
                <Text style={styles.counter}>{bets.length}/10 Bets</Text>
              </View>

              {/* Right side (total win) */}
              <View style={styles.infoBoxRight}>
                <Text style={styles.total}>{totalWin.toFixed(2)}</Text>
                <Text style={styles.totalLabel}>Total win INR</Text>
              </View>
            </View>

            {/* Progress Bar inside infobox */}
            <View style={styles.progressWrapper}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${(bets.length / 100) * 100}%` },
                ]}
              />
            </View>
          </View>


          {/* Table Header */}
          <View style={styles.headerRow}>
            <Text style={styles.header}>Player</Text>
            <Text style={styles.header}>Bet INR</Text>
            <Text style={styles.header}>X</Text>
            <Text style={styles.header}>Win INR</Text>
          </View>

          {/* Bets List */}
          <View style={styles.listWrapper}>
            <FlatList
              data={visibleBets}
              keyExtractor={(item) => item.id}
              renderItem={renderBet}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </View>
        </View>
      )}
      {/* Previous Bets */}
      {activeTab === "Previous" && (
        <View style={{ flex: 1 }}>
          {/* Round Result Box */}
          <View style={styles.roundResultBox}>
            <Text style={styles.roundLabel}>Round Result</Text>
            <Text style={styles.roundValue}>2.64x</Text>
          </View>

          {/* Table Header */}
          <View style={styles.headerRow}>
            <Text style={[styles.header, { flex: 2 }]}>Player</Text>
            <Text style={[styles.header, { flex: 1, textAlign: "right" }]}>Bet INR</Text>
            <Text style={[styles.header, { flex: 1, textAlign: "center" }]}>X</Text>
            <Text style={[styles.header, { flex: 1, textAlign: "right" }]}>Win INR</Text>
          </View>
          {/* Bets List */}
          <FlatList
            data={visibleBets}
            keyExtractor={(item) => item.id}
            renderItem={renderBet}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
          />
        </View>
      )}
      {/* Top Filters */}
      {activeTab === "Top" && (
        <View style={{ flex: 1 }}>
          {/* ----- Top Filters (fixed above) ----- */}
          <View style={styles.filterBox}>
            {/* Filter Row */}
            <View style={styles.filterRow}>
              {["X", "Win", "Rounds"].map((f) => (
                <TouchableOpacity
                  key={f}
                  style={[styles.filterBtn, filter === f && styles.activeFilter]}
                  onPress={() => setFilter(f)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      filter === f && styles.activeFilterText,
                    ]}
                  >
                    {f}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Period Row */}
            <View style={styles.filterRow}>
              {["Day", "Month", "Year"].map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[styles.filterBtn, period === p && styles.activeFilter]}
                  onPress={() => setPeriod(p)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      period === p && styles.activeFilterText,
                    ]}
                  >
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ----- FlatList (scrollable content) ----- */}
          <View style={styles.output}>
            <FlatList
              data={bets}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator
              contentContainerStyle={{ paddingVertical: 8, paddingBottom: 40 }}
              renderItem={({ item }) => {
                // shared UI for Win / X mode
                if (filter === "Win" || filter === "X") {
                  return (
                    <View style={styles.card}>
                      {/* Top Row */}
                      <View style={styles.topRow}>
                        <View style={styles.userSection}>
                          <Image source={{ uri: item.avatar }} style={styles.avatar} />
                          <View>
                            <Text style={styles.userName}>{item.user}</Text>
                            <Text style={styles.dateText}>12.231.12</Text>
                          </View>
                        </View>

                        <View style={styles.iconSection}>
                          <TouchableOpacity style={styles.iconCircle}>
                            <Icon name="check" size={18} color="#D6D6D6" />
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.iconCircle}>
                            <Icon name="shield-outline" size={18} color="#D6D6D6" />
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* Bottom Info */}
                      <View style={styles.bottomRow}>
                        <View style={styles.leftCol}>
                          <View style={styles.infoRow}>
                            <Text style={styles.label}>BET INR</Text>
                            <Text style={styles.value}>{item.bet.toFixed(2)}</Text>
                          </View>
                          <View style={styles.infoRow}>
                            <Text style={styles.label}>Win INR</Text>
                            {item.cashout !== undefined ? item.cashout.toFixed(2) : "---"}
                          </View>
                        </View>

                        <View style={styles.rightCol}>
                          <View style={styles.infoRow}>
                            <Text style={styles.label}>Result</Text>
                            {item.multiplier !== undefined ? `${item.multiplier.toFixed(2)}x` : "---"}
                          </View>
                          <View style={styles.infoRow}>
                            <Text style={styles.label}>Round max.</Text>
                            <Text style={styles.pink}>4,735.41x</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                }

                // Rounds view
                if (filter === "Rounds") {
                  return (
                    <View style={styles.roundsRow}>
                      <Text style={styles.roundDate}>13.09.25 12:16</Text>
                      <Text style={styles.roundMult}>
                        {item.multiplier !== undefined ? `${item.multiplier.toFixed(2)}x` : "---"}
                      </Text>
                      <Text style={styles.roundIcon}>⚪</Text>
                    </View>
                  );
                }

                return null;
              }}
            />
          </View>
        </View>
      )}
      {/* ✅ FOOTER */}
      <View style={styles.footer}>
        <View style={styles.footerTop}>
          <MaterialIcons
            name="gpp-good"
            size={15}
            color="#808080ff"
            style={{ marginRight: 5 }}
          />
          <Text style={styles.footerText}>Provably Fair Game</Text>
          <Text style={styles.footerPowered}>
            <Text style={styles.poweredGray}>POWERED BY </Text>
            <Text style={styles.poweredWhite}>SPRIBE</Text>
          </Text>
        </View>

      </View>
    </View >
  );
};

// STYLES
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1B1C1E",
    borderRadius: 17,
    padding: 8,
    marginHorizontal: 5,
    marginTop: 5,
    flex: 1,
    flexDirection: "column",
  },
  prevListWrapper: {
    flex: 1,          // fills remaining space in the “Previous Bets” view
    overflow: "hidden",
    maxHeight: 250,   // optional – controls visible list height
  },

  /* ---------- Footer ---------- */
  footer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    marginBottom: 4,
  },
  output: {
    backgroundColor: "#1B1C1E",
    borderRadius: 12,
  },
  footerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    color: "#bbb",
    fontSize: 9,
    fontFamily: "NotoSansSyriacWestern-VariableFont_wght",
    letterSpacing: 0.3,
  },
  footerPowered: { marginTop: 2, marginLeft: 110 },
  poweredGray: {
    color: "#888",
    fontSize: 9,
    fontFamily: "Roboto-VariableFont_wdth,wght",
  },
  poweredWhite: {
    color: "#fff",
    fontSize: 9,
    fontFamily: "Anton-Regular",
    letterSpacing: 0.5,
  },
  tabRow: {
    borderRadius: 16,
    flexDirection: "row",
    marginBottom: 5,
    height: 31,
    backgroundColor: "#111",
  },
  roundsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginVertical: 4,
    marginHorizontal: 5,
  },
  roundDate: {
    color: "#aaa",
    fontSize: 12,
    flex: 1,
  },
  roundMult: {
    color: "#b026ff", // purple highlight
    fontSize: 14,
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
  },
  roundIcon: {
    color: "#888",
    fontSize: 14,
    marginLeft: 10,
  },
  listWrapper: {
    flex: 1,

  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 23,
    height: 25,
    marginTop: 3.25,
    marginHorizontal: 3.6,
  },
  activeTab: {
    backgroundColor: "#333",
  },
  betText: {
    color: "#fff",        // white for bet
    fontSize: 12,
    marginBottom: 2,
  },

  winText: {
    color: "#fff",        // white for win
    fontSize: 12,
    marginBottom: 4,
  },

  resultText: {
    color: "#b026ff",     // purple highlight for Result
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 2,
    textAlign: "right",   // align to right if needed
  },

  roundText: {
    color: "#b026ff",     // purple highlight for Round max
    fontSize: 12,
    fontWeight: "600",
    textAlign: "right",
  },

  tabText: {
    color: "#aaa",
    fontSize: 12,
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "700",
  },



  topLeft: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "#ffffffff",
    flex: 1,
  },

  topAvatar: {
    width: 45,
    height: 45,
    borderRadius: 16,
    paddingLeft: 40,
  },





  topRight: {
    marginLeft: 0,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },

  label: {
    color: "#aaa",
    fontSize: 11,
    flex: 1,
  },

  value: {
    color: "#fff",
    fontSize: 11,
    flex: 1,
    textAlign: "right",
  },

  resultValue: {
    color: "#ba44ffff", // purple highlight
    fontSize: 11,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },


  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  header: { color: "#aaa", fontSize: 10, marginVertical: 5, flex: 1.5, textAlign: "center", borderBlockColor: "red" },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingLeft: 10,
    borderRadius: 60,
    marginVertical: 2,
    paddingHorizontal: 6,
  },
  playerCell: {
    flex: 1.5,
    flexDirection: "row",
    alignItems: "center",
  },
  cell: { color: "#d1d1d1ff", fontSize: 10, marginLeft: 8, fontFamily: "AnekTelugu-VariableFont_wdth,wght", },
  betCell: { flex: 1, color: "#d1d1d1ff", textAlign: "center", fontSize: 10, fontFamily: "AnekTelugu-VariableFont_wdth,wght" },
  multCell: { flex: 1, color: "#d1d1d1ff", fontWeight: "bold", textAlign: "center", fontSize: 10, fontFamily: "AnekTelugu-VariableFont_wdth,wght" },
  cashCell: { flex: 1, color: "#d1d1d1ff", textAlign: "center", fontSize: 10, fontFamily: "AnekTelugu-VariableFont_wdth,wght" },


  filterBox: { backgroundColor: "#111", borderRadius: 14, paddingVertical: 2, },
  filterRow: {
    flexDirection: "row",

    justifyContent: "space-around",
    marginVertical: 1.55,
  },
  filterBtn: {
    paddingVertical: 9,
    alignItems: "center",
    justifyContent: "center", width: 100,
    borderRadius: 13,
    backgroundColor: "#111",
  },
  activeFilter: { backgroundColor: "#333" },
  filterText: { color: "#aaa", fontSize: 10 },
  activeFilterText: { color: "#fff", fontWeight: "700" },


  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
  },



  infoRight: { alignItems: "flex-end" },


  infoBox: {
    borderRadius: 15,
    backgroundColor: "#111",
    padding: 9,
  },


  infoBoxLeft: {
    alignItems: "center",
  },

  avatars: {
    flexDirection: "row",
    marginRight: 8,
  },

  avatar: {
    width: 20,
    height: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2c8013ff",
  },

  counter: { color: "#aaa", fontSize: 10 },

  infoBoxRight: { alignItems: "flex-end" },
  total: { color: "#fff", fontSize: 13, fontWeight: "bold" },
  totalLabel: { color: "#bbb", fontSize: 12 },

  progressWrapper: {
    width: "100%",
    height: 6,
    backgroundColor: "#222",
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 4,
    marginBottom: 2,
  },
  progressBar: { height: "100%", backgroundColor: "#3F7C08" },
  roundResultBox: {
    backgroundColor: "#111",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginBottom: 8,
  },
  roundLabel: {
    color: "#aaa",
    fontSize: 12,
  },
  roundValue: {
    color: "#ff00c3ff", // purple-ish (like your screenshot)
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 2,
  },













  card: {
    backgroundColor: "#111",
    borderRadius: 30,
    padding: 12,
    width: 340,
    marginTop: 10,
    alignSelf: "center",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userSection: {
    flexDirection: "row",
    marginLeft:20,
    alignItems: "center",
  },

  userName: {
    color: "#FFF",
    fontSize: 15,
        marginLeft:20,

    fontFamily : "CrimsonPro-Bold",
  },
  dateText: {
    color: "#A9A9A9",
    fontSize: 12,
    marginTop: 2,

    fontFamily:"Roboto-VariableFont_wdth,wght",
  },
  iconSection: {
    flexDirection: "row",
    gap: 10,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#c2a746",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  leftCol: {
    flex: 1,
  },
  rightCol: {
    flex: 1,
    alignItems: "flex-end",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },

  pink: {
    color: "#ff00ff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default BetHistory;


