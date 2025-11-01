// src\components\Deposit\DepositModal.tsx

import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// ✅ Define your own PaymentMethod type here
// in DepositModal.tsx
export type PaymentMethod = {
  id: number;
  name: string;
  image: any;
};
type DepositModalProps = {

  onClose: () => void;
  onSelectMethod: (method: PaymentMethod) => void;
};


const DepositModal: React.FC<DepositModalProps> = ({
  onClose,
  onSelectMethod,
}) => {
  const paymentMethods: PaymentMethod[] = [
    { id: 1, name: "PhonePe", image: require("../../../assets/phonepe.png") },
    { id: 2, name: "UPI", image: require("../../../assets/upi.png") },
    { id: 3, name: "PayTm", image: require("../../../assets/Paytm.png") },
  ];

  return (
    <View style={styles.overlay}>
      <View style={styles.modalBox}>
        <View style={styles.header}>
          <Text style={styles.title}>Deposit</Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <Text style={styles.subText}>Select a deposit method</Text>

        <ScrollView contentContainerStyle={styles.methodList}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={styles.methodCard}
              onPress={() => onSelectMethod(method)}
            >
              <Image
                source={method.image}
                style={styles.methodImage}
                resizeMode="contain"
              />
              <Text style={styles.methodText}>{method.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: "100%",
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
  methodImage: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  methodText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
});

export default DepositModal;
