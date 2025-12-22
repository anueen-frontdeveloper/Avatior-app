// src/components/Header.tsx

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
import ProfileScreen from "./profile/profilesscree";

export default function Header() {
  const [walletVisible, setWalletVisible] = useState(false);
  const [isYellow, setIsYellow] = useState(false);
  const [ProfileVisible, setProfileVisible] = useState(false);
  const { balance } = useTotalBet();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  return (
    <View style={styles.container}>
      {/* Left Section */}
      <View style={styles.left}>
        <TouchableOpacity onPress={() => setProfileVisible(true)} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="chevron-back-outline" size={18} color="#c7c7c7ff" />
        </TouchableOpacity>
        <Text style={styles.backText}>Profile</Text>
      </View>

      <Text style={[styles.centerText, { textAlign: 'right' }]}>
        <Text style={{ color: '#a0a0a0ff' }}>INR
          <Icon
            name="keyboard-arrow-down"
            size={14}
            color="#a0a0a0ff"
            style={{
              marginLeft: 2,
              alignSelf: 'center', // centers vertically in parent
              paddingTop: 0,       // remove this
            }}
          />

          {'\n'} </Text>
        <Text style={{ color: '#fff', fontSize: 11, fontFamily: 'CrimsonPro-Bold' }}>
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
        <TouchableOpacity
          style={styles.starWrapper}
          onPress={() => setIsYellow(!isYellow)}  // toggle color
          activeOpacity={0.7}
        >
          <FontAwesome
            name="star"
            size={18}
            color={isYellow ? '#FFD700' : '#FFFFFF'}  // yellow or white
          />
        </TouchableOpacity>
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
    paddingVertical: 15,
    backgroundColor: "#141414ff", // Header background
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 10,
    fontFamily: "StackSansText-Regular",
  },
  centerText: {
    color: "#afafafff",
    fontSize: 11,
    fontFamily: "Poppins-Regular",
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
    fontFamily: "Ramabhadra-Regular", // 👈 use loaded custom font
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
