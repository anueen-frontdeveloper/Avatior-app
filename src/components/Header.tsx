// src/components/Header.tsx

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DepositModal from "./Deposit/DepositModal";
import DepositWallet from "./Deposit/DepositWallet";
import { useTotalBet } from "../context/BalanceContext";
import ProfileScreen from "./profile/profilesscree";

// Define type locally if not exported
type PaymentMethod = any; 

export default function Header() {
  const [walletVisible, setWalletVisible] = useState(false);
  const [isYellow, setIsYellow] = useState(false);
  const [ProfileVisible, setProfileVisible] = useState(false);
  const { balance } = useTotalBet();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  return (
    <View style={styles.container}>
      
      {/* --- Left Section: Profile/Back --- */}
      <TouchableOpacity
        style={styles.leftContainer}
        onPress={() => setProfileVisible(true)}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={20} color="#fff" />
        {/* Using Roboto-Medium for navigation text */}
        <Text style={styles.backText}>Profile</Text>
      </TouchableOpacity> 

      {/* --- Right Section: Balance, Deposit, Star --- */}
      <View style={styles.rightContainer}>
        
        {/* Balance Area */}
        <View style={styles.balanceWrapper}>
          <View style={styles.currencyRow}>
            <Text style={styles.currencyText}>INR</Text>
            <MaterialIcons name="keyboard-arrow-down" size={12} color="#8E8E93" style={{ marginTop: 1 }} />
          </View>
          {/* Using Roboto-Bold for numbers */}
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
          {/* Using Roboto-Bold for button text */}
          <Text style={styles.depositText}>Deposit</Text>
        </TouchableOpacity>

        {/* Star Button */}
        <TouchableOpacity
          style={styles.starBtn}
          onPress={() => setIsYellow(!isYellow)}
          activeOpacity={0.7}
        >
          <FontAwesome
            name="heart"
            size={14}
            color={isYellow ? '#FFD700' : '#FFFFFF'}
          />
        </TouchableOpacity>
      </View>

      {/* --- MODALS --- */}
      <Modal visible={walletVisible} animationType="fade" transparent>
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

      <Modal visible={ProfileVisible} animationType="fade" transparent={false}>
        <ProfileScreen onClose={() => setProfileVisible(false)} />
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Key for separating Left and Right
    paddingTop: 50, // Adjust for status bar
    paddingBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#141414ff", // Dark Grey background
  },

  // --- LEFT SIDE ---
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: "#fff",
    fontSize: 15,
    marginLeft: 4,
    // YOUR FONT:
    fontFamily: "Roboto-Medium", 
  },

  // --- RIGHT SIDE ---
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12, // Consistent spacing between elements
  },

  // Balance
  balanceWrapper: {
    alignItems: "flex-end", // Aligns text to right
    justifyContent: 'center',
    marginRight: 4,
  },
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: -2, // Pulls currency closer to numbers
  },
  currencyText: {
    color: "#8E8E93",
    fontSize: 10,
    marginRight: 2,
    // YOUR FONT:
    fontFamily: "Roboto-Bold",
  },
  balanceText: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 18,
    // YOUR FONT:
    fontFamily: "Roboto-Bold", 
  },

  // Deposit Button
  depositBtn: {
    backgroundColor: "#00C853", // Vibrant Green
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  depositText: {
    color: "#fff",
    fontSize: 13,
    // YOUR FONT:
    fontFamily: "Roboto-Bold",
  },

  // Star Button
  starBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#2C2C2E", // Darker Square
    alignItems: "center",
    justifyContent: "center",
  },
});