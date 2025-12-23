import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DepositModal from "./Deposit/DepositModal";
import DepositWallet from "./Deposit/DepositWallet";
import { useTotalBet } from "../context/BalanceContext";
import ProfileScreen from "./profile/profilesscree"; // Fixed typo in import if needed

// Define types locally if not exported
type PaymentMethod = any;

export default function Header() {
  const [walletVisible, setWalletVisible] = useState(false);
  const [ProfileVisible, setProfileVisible] = useState(false);
  const { balance } = useTotalBet();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  return (
    <View style={styles.container}>

      {/* --- LEFT: Back Button --- */}
      <TouchableOpacity
        style={styles.leftButton}
        onPress={() => setProfileVisible(true)}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={20} color="#fff" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* --- RIGHT GROUP: Balance + Deposit + Star --- */}
      <View style={styles.rightSection}>

        {/* Balance Text Block */}
        <View style={styles.balanceContainer}>
          <View style={styles.currencyRow}>
            <Text style={styles.currencyText}>INR</Text>
            <MaterialIcons name="keyboard-arrow-down" size={14} color="#8E8E93" />
          </View>
          <Text style={styles.balanceText}>
            {(balance ?? 0).toFixed(2)}
          </Text>
        </View>

        {/* Deposit Button */}
        <TouchableOpacity
          style={styles.depositBtn}
          onPress={() => setWalletVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.depositText}>Deposit</Text>
        </TouchableOpacity>

        {/* Star Button */}
        <TouchableOpacity
          style={styles.starBtn}
          activeOpacity={0.7}
        >
          <FontAwesome name="star" size={14} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* --- MODALS --- */}
      <Modal visible={walletVisible} animationType="slide" transparent>
        {selectedMethod ? (
          <DepositWallet
            method={selectedMethod}
            onBack={() => setSelectedMethod(null)}
            onClose={() => setWalletVisible(false)}
            onDeposit={(amount) => console.log("Deposited:", amount)}
          />
        ) : (
          <DepositModal
            onClose={() => setWalletVisible(false)}
            onSelectMethod={(method) => setSelectedMethod(method)}
          />
        )}
      </Modal>

      <Modal visible={ProfileVisible} animationType="slide" transparent={false}>
        <ProfileScreen onClose={() => setProfileVisible(false)} />
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Pushes Left and Right apart
    paddingTop: 50, // Adjusted for status bar
    paddingBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#191919", // Exact dark grey from image
  },

  // --- Left Side ---
  leftButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 4,
    // System font looks closest to the image
  },

  // --- Right Side Group ---
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12, // Consistent spacing between Balance, Deposit, and Star
  },

  // Balance
  balanceContainer: {
    alignItems: "flex-end", // Aligns text to the right
    justifyContent: "center",
    marginRight: 4,
  },
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyText: {
    color: "#8E8E93", // Light grey
    fontSize: 10,
    fontWeight: "700",
    marginRight: 2,
  },
  balanceText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700", // Bold font matches image
    lineHeight: 18,
  },

  // Deposit Button
  depositBtn: {
    backgroundColor: "#00C853", // Bright Green
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  depositText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },

  // Star Button
  starBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#2C2C2E", // Darker grey square
    alignItems: "center",
    justifyContent: "center",
  },
});