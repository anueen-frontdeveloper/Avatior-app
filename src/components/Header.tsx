//src/components/Header.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; // back icon
import FontAwesome from "react-native-vector-icons/FontAwesome"; // star icon
import DepositModal from "./Deposit/DepositModal";
type Props = { balance: number; onPressTestBet?: () => void; };
import { useTotalBet } from "../context/BalanceContext";
import DepositWallet from "./Deposit/DepositWallet";
import type { PaymentMethod } from "./Deposit/DepositModal";
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Header() {
  const [walletVisible, setWalletVisible] = useState(false);
  const { balance } = useTotalBet();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  return (
    <View style={styles.container}>
      {/* Left Section */}
      <View style={styles.left}>
        <Ionicons name="arrow-back" size={22} color="white" />
        <Text style={styles.backText}>Back</Text>
      </View>

      <Text style={[styles.centerText, { textAlign: 'right' }]}>
        <Text style={{ color: '#a0a0a0ff' }}>INR
          <Icon name="keyboard-arrow-down" size={14} color="#a0a0a0ff" style={{ marginLeft: 2 }} />

          {'\n'} </Text>
        <Text style={{ color: '#fff', fontSize: 11, fontFamily: 'Barlow-Bold' }}>
          {(balance ?? 0).toFixed(2)}
        </Text>
      </Text>


      {/* Right Section */}
      <View style={styles.right}>
        <TouchableOpacity style={styles.depositBtn} onPress={() => setWalletVisible(true)}>

          <Text style={styles.depositText}>Deposit</Text>
        </TouchableOpacity>
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
        <View style={styles.starWrapper}>
          <FontAwesome name="star" size={18} color="#fff" />
        </View>
      </View>



    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 40,
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
    color: "#b1b1b1ff",
    fontSize: 11,
    marginLeft: 88,
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
    paddingHorizontal: 14,
  },
  depositText: {
    color: "white",
    fontSize: 12,
    fontFamily: "Barlow-Bold", // 👈 use loaded custom font
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
