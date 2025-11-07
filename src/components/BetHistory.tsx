import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const BetHistory = () => {
  const [activeTab, setActiveTab] = useState<"All Bets" | "Previous" | "Top">(
    "All Bets"
  );

  return (
    <View style={styles.container}>
      {/* ✅ TAB ROW */}
      <View style={styles.tabRow}>
        {["All Bets", "Previous", "Top"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab as any)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ✅ TAB CONTENT BOX */}
      <View style={styles.contentBox}>
        {activeTab === "All Bets" && (
          <Text style={styles.sectionText}>All Bets Section</Text>
        )}
        {activeTab === "Previous" && (
          <Text style={styles.sectionText}>Previous Section</Text>
        )}
        {activeTab === "Top" && (
          <Text style={styles.sectionText}>Top Section</Text>
        )}
      </View>

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
    </View>
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
  },

  /* ---------- Tabs ---------- */
  tabRow: {
    borderRadius: 16,
    flexDirection: "row",
    marginBottom: 5,
    height: 37,
    backgroundColor: "#111",
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 23,
    height: 30,
    marginTop: 3.25,
    marginHorizontal: 3.6,
  },
  activeTab: { backgroundColor: "#2c2c2cff" },
  tabText: { color: "#aaa", fontSize: 10 , fontFamily: "Roboto-VariableFont_wdth,wght"},
  activeTabText: { color: "#fff",  },

  /* ---------- Content Box ---------- */
  contentBox: {
    backgroundColor: "#111",
    borderRadius: 15,
    marginTop: 8,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 500,
  },
  sectionText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Roboto-VariableFont_wdth,wght",
  },

  /* ---------- Footer ---------- */
  footer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    marginBottom: 4,
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
  footerPowered: {  marginTop: 2, marginLeft: 110 },
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
});

export default BetHistory;
