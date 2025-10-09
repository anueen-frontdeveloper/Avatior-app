import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from "react-native";


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
};

type BetHistoryProps = {
  liveMultiplier: number;
  isRunning: boolean;
  bets: Bet[];
  onTotalWinChange?: (total: number) => void; // ✅ new optional prop
  setBets: React.Dispatch<React.SetStateAction<Bet[]>>;

};

const BetHistory: React.FC<BetHistoryProps> = ({
  liveMultiplier,
  isRunning,
  bets,
  setBets,
  onTotalWinChange,
}) => {
  const [activeTab, setActiveTab] = useState<"All Bets" | "Previous" | "Top">(
    "All Bets"
  );

  const [filter, setFilter] = useState("X");
  const [period, setPeriod] = useState("Day");
  // const [total, setMessage] = useState(1000);
  const visibleBets = bets.filter(b => b.isVisible !== false);
  const [totalWin, setTotalWin] = useState(0);

  // 🔹 1️⃣ Create new fake players ONLY during wait phase
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
        return [mine, ...randomBets];
      });
    }
  }, [isRunning]);

  // Auto cashout simulation (only a few users)
  useEffect(() => {
    if (!isRunning) {
      return;
    }

    bets.forEach(b => {
      if (b.isMine || b.cashout !== undefined) return;

      if (b.multiplierTarget && liveMultiplier >= b.multiplierTarget) {
        const delay = Math.random() * 300; // random small delay
        setTimeout(() => {
          setBets(prev =>
            prev.map(p =>
              p.id === b.id
                ? {
                  ...p,
                  multiplier: b.multiplierTarget,
                  cashout: p.bet * b.multiplierTarget!, // ✅ safe non-null
                }
                : p
            )
          );

        }, delay);
      }
    });
  }, [liveMultiplier, isRunning]);

  !isRunning && visibleBets.length === 0 && (
    <Text style={{ textAlign: "center", color: "#888", marginVertical: 10 }}>
      Waiting for next round...
    </Text>
  )

  useEffect(() => {
    if (isRunning) {
      setBets(prev => prev.map(b =>
        b.isMine
          ? { ...b, cashout: undefined, multiplier: undefined, isVisible: true }
          : { ...b, cashout: undefined, multiplier: undefined }
      ));
    }
  }, [isRunning]);



  // 👇 Reset fake players at round start


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

        <View>
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
                <Text style={styles.total}>₹{totalWin.toFixed(2)}</Text>
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

          <FlatList
            data={visibleBets}
            keyExtractor={item => item.id}
            renderItem={renderBet}
          />

        </View>
      )
      }
      {/* Previous Bets */}
      {activeTab === "Previous" && (
        <View>
          {/* Round Result Box */}
          <View style={styles.roundResultBox}>
            <Text style={styles.roundLabel}>Round Result</Text>
            <Text style={styles.roundValue}>2.64x</Text>
          </View>

          {/* Table Header */}
          {/* Table Header */}
          <View style={styles.headerRow}>
            <Text style={[styles.header, { flex: 2 }]}>Player</Text>
            <Text style={[styles.header, { flex: 1, textAlign: "right" }]}>Bet INR</Text>
            <Text style={[styles.header, { flex: 1, textAlign: "center" }]}>X</Text>
            <Text style={[styles.header, { flex: 1, textAlign: "right" }]}>Win INR</Text>
          </View>


          {/* Bets List */}
          <FlatList
            data={bets}
            keyExtractor={(item) => item.id}
            renderItem={renderBet}
            style={{ maxHeight: 300 }}
          />


        </View>
      )}

      {/* Top Filters */}
      {
        activeTab === "Top" && (
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

            {/* Now instead of debug text, render bet list */}
            <FlatList
              data={bets}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                if (filter === "Win") {
                  return (
                    <View style={styles.topRow}>
                      <View style={styles.topLeft}>
                        <Image
                          source={{ uri: item.avatar }}
                          style={styles.avatar}
                        />
                        <View>
                          <Text style={styles.userName}>{item.user}</Text>
                          <Text style={styles.dateText}>13.09.25</Text>
                        </View>
                      </View>

                      <View style={styles.topRight}>
                        <Text style={styles.betText}>Bet INR {item.bet.toFixed(2)}</Text>
                        <Text style={styles.winText}>
                          Win INR {item.cashout !== undefined ? item.cashout.toFixed(2) : "---"}
                        </Text>
                        <Text style={styles.resultText}>
                          {item.multiplier !== undefined ? `${item.multiplier.toFixed(2)}x` : "---"}
                        </Text>
                        <Text style={styles.roundText}>Round max. 218.24x</Text>
                      </View>
                    </View>
                  );
                }


                if (filter === "X") {
                  return (
                    <View style={styles.topRow}>
                      <View style={styles.topLeft}>
                        <Image
                          source={{ uri: item.avatar }}

                          style={styles.avatar}
                        />
                        <View>
                          <Text style={styles.userName}>{item.user}</Text>
                          <Text style={styles.dateText}>13.09.25</Text>
                        </View>
                      </View>

                      <View style={styles.topRight}>
                        <Text style={styles.betText}>Bet INR {item.bet.toFixed(2)}</Text>

                        <Text style={styles.winText}>
                          Win INR {item.cashout !== undefined ? item.cashout.toFixed(2) : "---"}
                        </Text>

                        <Text style={styles.resultText}>
                          {item.multiplier !== undefined ? `${item.multiplier.toFixed(2)}x` : "---"}
                        </Text>

                        <Text style={styles.roundText}>Round max. 218.24x</Text>
                      </View>
                    </View>
                  );
                }


                if (filter === "Rounds") {
                  return (
                    <View style={styles.roundsRow}>
                      <Text style={styles.roundDate}>13.09.25 12:16</Text>

                      <Text style={styles.roundMult}>
                        {item.multiplier !== undefined ? `${item.multiplier.toFixed(2)}x` : "---"}
                      </Text>

                      <Text style={styles.roundIcon}>⚪</Text>
                      {/* placeholder for your icon */}
                    </View>
                  );
                }

                return null;
              }}
            />

          </View>
        )
      }


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

  topRow: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 5,
    marginVertical: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  topLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  topAvatar: {
    width: 35,
    height: 35,
    borderRadius: 16,
  },

  userName: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 12,
    fontWeight: "600",
  },

  dateText: {
    marginLeft: 12,
    color: "#aaa",
    fontSize: 10,
    marginTop: 2,
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
    padding: 12,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6, // space before progress bar
  },

  infoBoxLeft: {
    alignItems: "center",
  },

  avatars: {
    flexDirection: "row",
    marginRight: 8,
  },

  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginLeft: -6,
    borderWidth: 1,
    borderColor: "#2c8013ff",
  },

  counter: { color: "#aaa", fontSize: 12 },

  infoBoxRight: { alignItems: "flex-end" },
  total: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  totalLabel: { color: "#aaa", fontSize: 12 },

  progressWrapper: {
    width: "100%",
    height: 6,
    backgroundColor: "#222",
    borderRadius: 6,
    overflow: "hidden",
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
});

export default BetHistory;
