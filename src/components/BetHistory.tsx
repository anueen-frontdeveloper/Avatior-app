import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from "react-native";
import { useEarnings } from "../context/EarningsContext"; // Keeping only for balance updates
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

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
  didLose?: boolean;
  date?: string;
};

type BetHistoryProps = {
  liveMultiplier: number;
  isRunning: boolean;
  userBetAmount: number | null; 
  userCashedOutAt: number | null; 
};


const BetHistory: React.FC<BetHistoryProps> = ({
  liveMultiplier,
  isRunning,
  userBetAmount,
  userCashedOutAt,
}) => {
  const { addEarnings } = useEarnings();
  const [bets, setBets] = useState<Bet[]>([]);

  const [activeTab, setActiveTab] = useState<"All Bets" | "Previous" | "Top">("All Bets");
  const [fakeTotalUsers, setFakeTotalUsers] = useState(9842);
  const [totalWin, setTotalWin] = useState(0);
  
  const [filter, setFilter] = useState("X");

  const winnersCount = bets.filter(b => b.cashout !== undefined).length;
  const totalBots = bets.length;
  const winPercentage = totalBots > 0 ? (winnersCount / totalBots) * 100 : 0;
  const visibleBets = bets.filter(b => b.isVisible !== false);

  // --- 1. INITIALIZE ROUND (Generate 200 Bots) ---
  useEffect(() => {
    if (!isRunning) {
      setFakeTotalUsers(Math.floor(Math.random() * 3000) + 8500);

      // Generate 200 Bots
      const botCount = 15;
      const randomBets: Bet[] = Array.from({ length: botCount }).map((_, i) => {
        const risk = Math.random();
        let target;
        if (risk < 0.4) target = parseFloat((Math.random() * 0.4 + 1.1).toFixed(2)); // 1.1x - 1.5x
        else if (risk < 0.8) target = parseFloat((Math.random() * 1.5 + 1.5).toFixed(2)); // 1.5x - 3.0x
        else target = parseFloat((Math.random() * 50 + 3.0).toFixed(2)); // 3.0x - 50x

        return {
          id: `bot_${i}`,
          user: `User${Math.floor(Math.random() * 90000) + 10000}`,
          bet: Math.floor(Math.random() * 10000) + 100,
          multiplierTarget: target,
          avatar: `https://i.pravatar.cc/40?img=${(i % 50) + 1}`,
          cashout: undefined,
          multiplier: undefined,
          isVisible: true,
          didLose: false,
        };
      });

      setBets(randomBets); // Reset with just bots
    }
  }, [isRunning]);


  // --- 2. GAME LOOP (Update Bots) ---
  useEffect(() => {
    setBets((prevBets) => {
      // Create a clean list of bots (remove old 'you' entries)
      const botsOnly = prevBets.filter((b) => !b.isMine);

      // If the user has placed a bet, add them to the TOP
      if (userBetAmount !== null && userBetAmount > 0) {
        const myBetEntry: Bet = {
          id: "you",
          user: "You",
          bet: userBetAmount,
          isMine: true,
          avatar: "https://i.pravatar.cc/40?img=0", // Your avatar
          isVisible: true,
          // If cashed out prop is set, show it. Otherwise undefined.
          cashout: userCashedOutAt ? userBetAmount * userCashedOutAt : undefined,
          multiplier: userCashedOutAt || undefined,
          // If game stopped, user didn't cashout, and bet exists -> You lost
          didLose: !isRunning && !userCashedOutAt,
        };
        return [myBetEntry, ...botsOnly];
      }

      // If no bet placed, just return bots
      return botsOnly;
    });
  }, [userBetAmount, userCashedOutAt, isRunning]);

  // --- 3. FINALIZE (Mark Losers) ---
  useEffect(() => {
    if (!isRunning) return;

    setBets(prev =>
      prev.map(b => {
        // Skip "You" (handled by prop effect above) and cashed out bots
        if (b.isMine || b.cashout !== undefined) return b;

        if (b.multiplierTarget && liveMultiplier >= b.multiplierTarget) {
          return {
            ...b,
            multiplier: b.multiplierTarget,
            cashout: b.bet * b.multiplierTarget,
          };
        }
        return b;
      })
    );
  }, [liveMultiplier, isRunning]);




  // --- 4. HANDLE "YOU" WINNING ---
  useEffect(() => {
    if (!isRunning) {
      setBets(prev =>
        prev.map(b => {
          if (b.cashout === undefined) {
            return { ...b, didLose: true };
          }
          return b;
        })
      );
    }
  }, [isRunning]);



  // --- 5. CALCULATE TOTAL WIN ---
  useEffect(() => {
    const sum = bets.reduce((acc, b) => acc + (b.cashout || 0), 0);
    setTotalWin(sum);
  }, [bets]);

  // --- FOOTER COMPONENT ---
  const FooterComponent = () => (
    <View style={styles.footer}>
      <View style={styles.footerTop}>
        <MaterialIcons name="gpp-good" size={15} color="#808080ff" style={{ marginRight: 5 }} />
        <Text style={styles.footerText}>Provably Fair Game</Text>
        <Text style={styles.footerPowered}>
          <Text style={styles.poweredGray}>POWERED BY </Text>
          <Text style={styles.poweredWhite}>SPRIBE</Text>
        </Text>
      </View>
    </View>
  );

  const renderBet = ({ item }: { item: Bet }) => {
    const isWin = item.cashout !== undefined;
    // Highlight You: Green border if mine
    const borderColor = item.isMine ? (isWin ? "#00ff00" : "#fff") : "transparent";
    const bgColor = isWin ? "rgba(31, 50, 13, 0.8)" : "#101112";
    const textColor = isWin ? "#4f9222ff" : "#ccc";

    return (
      <View style={[styles.row, { backgroundColor: bgColor, borderColor: item.isMine ? '#333' : 'transparent', borderWidth: item.isMine ? 1 : 0 }]}>
        <View style={styles.playerCell}>
          <Image source={{ uri: item.avatar }} style={[styles.avatar, item.isMine && { borderColor: '#fff', borderWidth: 1 }]} />
          <Text style={[styles.cell, item.isMine && { color: '#fff', fontWeight: '900' }]}>{item.user}</Text>
        </View>
        <Text style={styles.betCell}>{item.bet.toFixed(2)}</Text>
        <Text style={styles.multCell}>
          {item.multiplier !== undefined ? `${item.multiplier.toFixed(2)}x` : `-`}
        </Text>
        <Text style={[styles.cashCell, { color: textColor }]}>
          {item.cashout !== undefined ? item.cashout.toFixed(2) : "-"}
        </Text>
      </View>
    );
  };


  return (
    <View style={styles.container}>
      <View style={styles.tabRow}>
        {["All Bets", "Previous", "Top"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab as any)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {activeTab === "All Bets" && (
        <View style={{ flex: 1 }}>
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <View style={styles.infoBoxLeft}>
                <View style={styles.avatars}>
                  <Image source={{ uri: "https://i.pravatar.cc/50?img=11" }} style={styles.avatar} />
                  <Image source={{ uri: "https://i.pravatar.cc/50?img=33" }} style={styles.avatar} />
                  <Image source={{ uri: "https://i.pravatar.cc/50?img=12" }} style={styles.avatar} />
                </View>
                <Text style={styles.counter}>{fakeTotalUsers.toLocaleString()} Bets</Text>
              </View>

              <View style={styles.infoBoxRight}>
                <Text style={styles.total}>{totalWin.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                <Text style={styles.totalLabel}>Total win INR</Text>
              </View>
            </View>

            <View style={styles.progressWrapper}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${winPercentage}%` },
                ]}
              />
            </View>
          </View>

          <View style={styles.headerRow}>
            <Text style={styles.header}>Player</Text>
            <Text style={styles.header}>Bet INR</Text>
            <Text style={styles.header}>X</Text>
            <Text style={styles.header}>Win INR</Text>
          </View>

          <View style={styles.listWrapper}>
            <FlatList
              data={visibleBets}
              keyExtractor={(item) => item.id}
              renderItem={renderBet}
              // --- PERFORMANCE OPTIMIZATIONS ---
              initialNumToRender={12}
              maxToRenderPerBatch={10}
              windowSize={5}
              removeClippedSubviews={true}
              showsVerticalScrollIndicator={true}
              // --- FOOTER IS HERE ---
              ListFooterComponent={FooterComponent}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </View>
        </View>
      )}

      {activeTab === "Previous" && (
        <View style={{ flex: 1 }}>
          <View style={styles.roundResultBox}>
            <Text style={styles.roundLabel}>Round Result</Text>
            <Text style={styles.roundValue}>2.64x</Text>
          </View>
          <FlatList
            data={visibleBets}
            keyExtractor={(item) => item.id}
            renderItem={renderBet}
            ListFooterComponent={FooterComponent}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>
      )}

      {activeTab === "Top" && (
        <View style={{ flex: 1 }}>
          <View style={styles.filterBox}>
            <View style={styles.filterRow}>
              {["X", "Win", "Rounds"].map((f) => (
                <TouchableOpacity key={f} style={[styles.filterBtn, filter === f && styles.activeFilter]} onPress={() => setFilter(f)}>
                  <Text style={[styles.filterText, filter === f && styles.activeFilterText]}>{f}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <Text style={{ color: '#555', textAlign: 'center', marginTop: 20 }}>Top bets list...</Text>
          <View style={{ marginTop: 'auto' }}>
            <FooterComponent />
          </View>
        </View>
      )}
    </View >
  );
};

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

  infoBox: {
    borderRadius: 15,
    backgroundColor: "#111",
    padding: 9,
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoBoxLeft: {
    alignItems: "flex-start",
    justifyContent: "center",
  },
  avatars: {
    flexDirection: "row",
    marginBottom: 4,
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#4f9222ff",
    marginRight: -8,
  },
  counter: {
    color: "#4f9222ff",
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
    marginLeft: 2
  },
  infoBoxRight: { alignItems: "flex-end" },
  total: { color: "#fff", fontSize: 13, fontWeight: "bold" },
  totalLabel: { color: "#bbb", fontSize: 11 },
  progressWrapper: {
    width: "100%",
    height: 4,
    backgroundColor: "#222",
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 8,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4f9222ff",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  header: {
    color: "#777",
    fontSize: 10,
    flex: 1,
    textAlign: "center"
  },
  listWrapper: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginVertical: 1,
  },
  playerCell: {
    flex: 1.5,
    flexDirection: "row",
    alignItems: "center",
  },
  cell: { color: "#ccc", fontSize: 11, marginLeft: 8 },
  betCell: { flex: 1, color: "#ccc", textAlign: "center", fontSize: 11 },
  multCell: { flex: 1, color: "#fff", fontWeight: "bold", textAlign: "center", fontSize: 11 },
  cashCell: { flex: 1, color: "#ccc", textAlign: "center", fontSize: 11 },
  tabRow: {
    borderRadius: 20,
    flexDirection: "row",
    marginBottom: 5,
    height: 32,
    backgroundColor: "#0d0d0d",
    padding: 2,
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
  },
  activeTab: {
    backgroundColor: "#2C2C2E",
  },
  tabText: { color: "#777", fontSize: 11 },
  activeTabText: { color: "#fff", fontWeight: "700" },
  footer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  footerTop: { flexDirection: "row", alignItems: "center" },
  footerText: { color: "#666", fontSize: 9 },
  footerPowered: { marginLeft: 10, flexDirection: 'row' },
  poweredGray: { color: "#666", fontSize: 9 },
  poweredWhite: { color: "#aaa", fontSize: 9, fontWeight: 'bold' },

  roundResultBox: { backgroundColor: "#111", borderRadius: 10, padding: 10, alignItems: "center", marginBottom: 8 },
  roundLabel: { color: "#aaa", fontSize: 12 },
  roundValue: { color: "#ff00c3", fontSize: 18, fontWeight: "bold" },
  filterBox: { backgroundColor: "#111", borderRadius: 14, paddingVertical: 2, marginBottom: 5 },
  filterRow: { flexDirection: "row", justifyContent: "space-around", marginVertical: 2 },
  filterBtn: { paddingVertical: 6, width: 80, alignItems: "center", borderRadius: 13 },
  activeFilter: { backgroundColor: "#333" },
  filterText: { color: "#aaa", fontSize: 10 },
  activeFilterText: { color: "#fff", fontWeight: "700" },
});

export default BetHistory;