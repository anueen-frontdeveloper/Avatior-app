//src/components/Header.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; // back icon
import FontAwesome from "react-native-vector-icons/FontAwesome"; // star icon
import DepositModal from "./DepositModal";
import WalletScreen from "./WalletScreen";
type Props = { balance: number; onPressTestBet?: () => void; };

export default function Header({ balance }: Props) {
  const [depositVisible, setDepositVisible] = useState(false);
  const [walletvisible, setwalletvisible] = useState(false);
  return (
    <View style={styles.container}>
      {/* Left Section */}
      <View style={styles.left}>
        <Ionicons name="arrow-back" size={22} color="white" />
        <Text style={styles.backText}>Back</Text>
      </View>

      {/* Middle Section */}
      <Text style={styles.centerText}>INR {balance.toFixed(2)}</Text>

      {/* Right Section */}
      <View style={styles.right}>
        <TouchableOpacity style={styles.depositBtn} onPress={() => setwalletvisible(true)}>
          <Text style={styles.depositText}>Deposit</Text>
        </TouchableOpacity>

        <View style={styles.starWrapper}>
          <FontAwesome name="star" size={18} color="#fff" />
        </View>
      </View>

      {/* Render Deposit Modal */}
      {walletvisible && (
        <View style={styles.walletOverlay}>
          <View style={styles.walletContainer}>
            <WalletScreen onClose={() => setwalletvisible(false)} />
          </View>
        </View>
      )}

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",

    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#000", // Header background
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: "white",
    fontSize: 16,
    marginLeft: 5,
  },
  centerText: {
    color: "white",
    fontSize: 12,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10, // RN 0.71+ supports `gap`
  },
  depositBtn: {
    backgroundColor: "#00B24C",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 15,
  },
  depositText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Oswald-VariableFont_wght", // 👈 use loaded custom font
  },
  walletOverlay: {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  height: "10%", // 👈 only 10% height for the WalletScreen
  backgroundColor: "rgba(0,0,0,0.6)", // dim overlay behind modal
  justifyContent: "flex-end",
},

walletContainer: {
  backgroundColor: "#fff",
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
},

  starWrapper: {
    width: 30,
    height: 30,
    borderRadius: 5,
    backgroundColor: "#181818ff",
    alignItems: "center",
    justifyContent: "center",
  },
});
