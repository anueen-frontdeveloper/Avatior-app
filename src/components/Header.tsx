//src/components/Header.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; // back icon
import FontAwesome from "react-native-vector-icons/FontAwesome"; // star icon
import DepositModal from "./DepositModal";
type Props = { balance: number; onPressTestBet?: () => void; };

export default function Header({ balance }: Props) {
  const [depositVisible, setDepositVisible] = useState(false);

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
        <TouchableOpacity style={styles.depositBtn} onPress={() => setDepositVisible(true)}>
          <Text style={styles.depositText}>Deposit</Text>
        </TouchableOpacity>

        <View style={styles.starWrapper}>
          <FontAwesome name="star" size={18} color="#fff" />
        </View>
      </View>

      {/* Render Deposit Modal */}
      {depositVisible && (
        <DepositModal
          visible={depositVisible}
          onClose={() => setDepositVisible(false)}
        />
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
  starWrapper: {
    width: 30,
    height: 30,
    borderRadius: 5,
    backgroundColor: "#181818ff",
    alignItems: "center",
    justifyContent: "center",
  },
});
