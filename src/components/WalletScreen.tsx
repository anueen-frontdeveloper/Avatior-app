import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  TouchableOpacity, // Import TouchableOpacity for custom buttons
  StatusBar,        // Import StatusBar to style the top bar
} from "react-native";
import DepositModal from "./DepositModal"; // Assuming these are also styled with a dark theme
import WithdrawalModal from "./WithdrawalModal"; // Assuming these are also styled with a dark theme
import { useTotalBet } from "../context/totalbetcontext";
// Define a type for the payment/deposit/withdrawal method
export interface PaymentMethod {
  id: string | number;
  name: string;
}

// ✅ Only onClose is needed
type WalletScreenProps = {
  onClose: () => void;
};

const WalletScreen: React.FC<WalletScreenProps> = ({ onClose }) => {
  const { balance } = useTotalBet();

  const [isDepositModalVisible, setDepositModalVisible] = useState(false);
  const [isWithdrawalModalVisible, setWithdrawalModalVisible] = useState(false);

  const handleSelectDepositMethod = (method: PaymentMethod) => {
    setDepositModalVisible(false);
    Alert.alert("Deposit Method", `You selected: ${method.name}`);
  };

  const handleSelectWithdrawalMethod = (method: PaymentMethod) => {
    setWithdrawalModalVisible(false);
    Alert.alert("Withdrawal Method", `You selected: ${method.name}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Use light-content for dark backgrounds */}
      <StatusBar barStyle="light-content" />

      {/* Balance Display - Styled like a HUD element */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>TOTAL BALANCE</Text>
        <Text style={styles.balanceAmount}>₹{balance.toFixed(2)} </Text>
      </View>

      {/* Action Buttons - Custom styled buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.depositButton]}
          onPress={() => setDepositModalVisible(true)}
        >
          <Text style={styles.actionButtonText}>DEPOSIT</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.withdrawalButton]}
          onPress={() => setWithdrawalModalVisible(true)}
        >
          <Text style={styles.actionButtonText}>WITHDRAW</Text>
        </TouchableOpacity>
      </View>

      {/* Close Wallet Button */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>CLOSE WALLET</Text>
      </TouchableOpacity>

      {/* Modals - NOTE: These modals should also be styled with a dark theme for consistency */}
      <DepositModal
        visible={isDepositModalVisible}
        onClose={() => setDepositModalVisible(false)}
        onSelectMethod={handleSelectDepositMethod}
      />

      <WithdrawalModal
        visible={isWithdrawalModalVisible}
        onClose={() => setWithdrawalModalVisible(false)}
        onSelectMethod={handleSelectWithdrawalMethod}
      />
    </SafeAreaView>
  );
};

// --- AVIATOR-THEMED STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d1b2a", // Dark navy/blue background
    alignItems: "center",
    paddingTop: 40,
  },
  balanceContainer: {
    alignItems: "center",
    padding: 25,
    backgroundColor: "#1b263b", // Slightly lighter dark blue
    borderRadius: 10,
    width: "90%",
    marginBottom: 40,
    borderWidth: 1,
    borderColor: "#e01e5a", // Aviator's signature red for borders
  },
  balanceLabel: {
    fontSize: 16,
    color: "#a9b4c2", // Muted light blue/gray text
    fontWeight: "600",
    textTransform: "uppercase", // Common in gaming UIs
    letterSpacing: 1.5,
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#f7b731", // A vibrant yellow for the amount
    marginTop: 8,
    fontFamily: "monospace", // Gives a digital clock/terminal feel
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Use space-between for full width
    width: "90%",
  },
  // Base style for our new custom buttons
  actionButton: {
    width: "48%", // Use percentages to fit container
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  // Specific colors for each button
  depositButton: {
    backgroundColor: "#27ae60", // Bright green for deposit (positive action)
  },
  withdrawalButton: {
    backgroundColor: "#c0392b", // Strong red for withdraw (negative action)
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  // Style for the close button
  closeButton: {
    marginTop: 30,
    width: "90%",
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e01e5a",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    color: "#e01e5a",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});

export default WalletScreen;