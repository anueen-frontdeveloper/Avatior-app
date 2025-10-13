import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTotalBet } from "../context/totalbetcontext";

// Your modals
import SettingsModal from "./SettingsModal";
import ChatModal from "./ChatModal";
import ProvablyFairModal from "./ProvablyFairModal";

type Props = { balance: number };

// Define all modal keys in one place
type ActiveModal = "settings" | "chat" | "provablyFair" | null;

const BalanceHeader: React.FC = () => {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const { balance } = useTotalBet();

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require("../../assets/logo.png")} style={styles.logo} />

      {/* Right: Balance + Actions */}
      <View style={styles.rightSection}>
        <Text style={styles.balanceText}>
          {balance.toFixed(2)} <Text style={styles.currency}>INR</Text>
        </Text>

        <TouchableOpacity
          onPress={() =>
            setActiveModal(prev => (prev === "settings" ? null : "settings"))
          }
          accessibilityLabel="Open settings menu"
        >
          <Ionicons name="menu" size={20} color="#c0c0c0" style={styles.icon} />
        </TouchableOpacity>


        {/* Chat */}
        <TouchableOpacity
          onPress={() => setActiveModal("chat")}
          accessibilityLabel="Open chat"
        >
          <Ionicons
            name="chatbubble-outline"
            size={20}
            color="#c0c0c0"
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      {/* Render Modals */}
      <SettingsModal
        visible={activeModal === "settings"}
        onClose={() => setActiveModal(null)}
      // could even inject a "show fairness" trigger inside settings:


      />
      <ProvablyFairModal
        visible={activeModal === "provablyFair"}
        onClose={() => setActiveModal(null)}
      />
      <ChatModal
        visible={activeModal === "chat"}
        onClose={() => setActiveModal(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1c1c1c",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  balanceText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#00B24C",
  },
  logo: {
    width: 90,
    height: 24,
  },
  currency: {
    color: "#c0c0c0",
  },
  icon: {
    marginLeft: 12,
  },
});

export default BalanceHeader;


