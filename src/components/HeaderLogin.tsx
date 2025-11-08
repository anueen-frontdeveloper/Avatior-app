import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; 
import FontAwesome from "react-native-vector-icons/FontAwesome"; 
import DepositModal from "./Deposit/DepositModal";
import { useTotalBet } from "../context/BalanceContext";
import DepositWallet from "./Deposit/DepositWallet";
import type { PaymentMethod } from "./Deposit/DepositModal";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function Header() {
  const [walletVisible, setWalletVisible] = useState(false);
  const [isYellow, setIsYellow] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  const { balance } = useTotalBet();

  const handleLogin = () => {
    console.log("Login button pressed");
    // navigation.navigate('Login') or show modal
  };

  const handleRegister = () => {
    console.log("Register button pressed");
    // navigation.navigate('Register') or show modal
  };

  return (
    <View style={styles.container}>
      {/* Left Section */}
      <View style={styles.left}>
        <Ionicons name="chevron-back-outline" size={18} color="#c7c7c7ff" />
        <Text style={styles.backText}>Back</Text>
      </View>

      {/* Center Balance */}
      <Text style={[styles.centerText, { textAlign: "right" }]}>
        <Text style={{ color: "#a0a0a0ff" }}>
          INR
          <Icon
            name="keyboard-arrow-down"
            size={14}
            color="#a0a0a0ff"
            style={{
              marginLeft: 2,
              alignSelf: "center",
            }}
          />
          {"\n"}
        </Text>
        <Text
          style={{
            color: "#fff",
            fontSize: 11,
            fontFamily: "CrimsonPro-Bold",
          }}
        >
          {(balance ?? 0).toFixed(2)}
        </Text>
      </Text>

      {/* Right Section */}
      <View style={styles.right}>
        {/* Login Button */}
        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        {/* Register Button */}
        <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>

        

        {/* Star Icon */}
        <TouchableOpacity
          style={styles.starWrapper}
          onPress={() => setIsYellow(!isYellow)}
          activeOpacity={0.7}
        >
          <FontAwesome
            name="star"
            size={18}
            color={isYellow ? "#FFD700" : "#FFFFFF"}
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
    backgroundColor: "#141414ff",
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
    gap: 10,
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
    fontFamily: "Ramabhadra-Regular",
  },
  loginBtn: {
    backgroundColor: "#222",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#555",
  },
  loginText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Ramabhadra-Regular",
  },
  registerBtn: {
    backgroundColor: "#0066FF",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  registerText: {
    color: "white",
    fontSize: 12,
    fontFamily: "Ramabhadra-Regular",
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
