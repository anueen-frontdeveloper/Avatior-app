import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTotalBet } from "../context/BalanceContext";

import SettingsModal from "./SettingsModal";
import ChatModal from "./ChatModal";
import ProvablyFairModal from "./ProvablyFairModal";

type ActiveModal = "settings" | "chat" | "provablyFair" | null;

type Props = {
  onPanelToggle: (open: boolean) => void;
};

const BalanceHeader: React.FC<Props> = ({ onPanelToggle }) => {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const { balance } = useTotalBet();

  const openModal = (key: ActiveModal) => {
    setActiveModal(key);
    onPanelToggle(true);
  };

  const closeModal = () => {
    setActiveModal(null);
    onPanelToggle(false);
  };

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/logo.png")} style={styles.logo} />

      <View style={styles.rightSection}>
        <Text style={styles.balanceText}>
          {(balance ?? 0).toFixed(2)}{" "}
          <Text style={styles.currency}>INR</Text>
        </Text>

        <TouchableOpacity
          onPress={() =>
            activeModal === "settings"
              ? closeModal()
              : openModal("settings")
          }
        >
          <Ionicons name="menu" size={16} color="#696969ff" style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => openModal("chat")}>
          <Ionicons
            name="chatbubble-outline"
            size={16}
            color="#696969ff"
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <SettingsModal visible={activeModal === "settings"} onClose={closeModal} />
      <ChatModal visible={activeModal === "chat"} onClose={closeModal} />
      <ProvablyFairModal
        visible={activeModal === "provablyFair"}
        onClose={closeModal}
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
    paddingHorizontal: 2,
    paddingVertical: 7.4,
  },
  rightSection: { flexDirection: "row", alignItems: "center" },
  balanceText: {
    fontSize: 12,
    color: "#28a909",
    fontFamily: "ZalandoSansSemiExpanded-Medium",
  },
  logo: { width: 90, height: 24 },
  currency: {
    color: "#949494ff",
    fontFamily: "CrimsonPro-Regular",
  },
  icon: { marginLeft: 12, marginRight: 12 },
});

export default BalanceHeader;
