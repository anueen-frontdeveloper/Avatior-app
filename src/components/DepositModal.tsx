import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type DepositModalProps = {
  visible: boolean;
  onClose: () => void;
};

const DepositModal: React.FC<DepositModalProps> = ({ visible, onClose }) => {
  const paymentMethods = [
    { id: 1, name: "PhonePe", icon: "cellphone" },
    { id: 2, name: "UPI", icon: "bank-transfer" },
    { id: 3, name: "PayTm", icon: "wallet" },
    { id: 4, name: "Bank transfer", icon: "bank" },
    { id: 5, name: "Cryptocurrency", icon: "bitcoin" },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Deposit</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subText}>Payment methods (India)</Text>

          {/* Payment options */}
          <ScrollView contentContainerStyle={styles.optionsWrapper}>
            {paymentMethods.map((item) => (
              <TouchableOpacity key={item.id} style={styles.optionBox}>
                <Icon name={item.icon} size={28} color="#555" />
                <Text style={styles.optionText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#fff", borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16, minHeight: "60%" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  title: { fontSize: 20, fontWeight: "bold" },
  subText: { color: "#666", marginBottom: 12 },
  optionsWrapper: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  optionBox: { width: "48%", backgroundColor: "#F5F5F5", padding: 16, borderRadius: 12, alignItems: "center", marginBottom: 12 },
  optionText: { marginTop: 8, fontSize: 14, fontWeight: "600", textAlign: "center" },
});

export default DepositModal;
