import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { PaymentMethod } from "./WalletScreen";

type WithdrawalModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelectMethod: (method: PaymentMethod) => void;
};

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  visible,
  onClose,
  onSelectMethod,
}) => {
  const withdrawalMethods: PaymentMethod[] = [
    { id: 1, name: "Bank Transfer" },
    { id: 2, name: "PayTm Wallet" },
    { id: 3, name: "PayPal" },
    { id: 4, name: "Crypto Wallet" },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <View style={styles.header}>
            <Text style={styles.title}>Withdraw</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subText}>Select a withdrawal method</Text>

          <ScrollView contentContainerStyle={styles.methodList}>
            {withdrawalMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={styles.methodCard}
                onPress={() => onSelectMethod(method)}
              >
                <Icon
                  name="bank-transfer"
                  size={28}
                  color="#444"
                  style={{ marginBottom: 6 }}
                />
                <Text style={styles.methodText}>{method.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: "60%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#111" },
  subText: { fontSize: 14, color: "#666", marginBottom: 15 },
  methodList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  methodCard: {
    width: "48%",
    backgroundColor: "#F4F4F4",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  methodText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
});

export default WithdrawalModal;
