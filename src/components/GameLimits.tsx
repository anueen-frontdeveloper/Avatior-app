import React from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, Dimensions } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");

type Props = {
  visible: boolean;
  onClose: () => void;
};

const GameLimits: React.FC<Props> = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>GAME LIMITS</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color="#ccc" />
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Content */}
          <View style={styles.content}>
            <View style={styles.row}>
              <Text style={styles.label}>Minimum bet INR:</Text>
              <Text style={styles.value}>7.00</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Maximum bet INR:</Text>
              <Text style={styles.value}>25,000.00</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Maximum win for bet INR:</Text>
              <Text style={styles.value}>25Lakh</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: width * 0.9,
    backgroundColor: "#1c1c1c",
    borderRadius: 10,
    paddingBottom: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2c2c2c",
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  title: {
    color: "#fff",
    fontWeight: "700",
    letterSpacing: 1,
    fontSize: 15,
  },
  divider: {
    height: 1,
    backgroundColor: "#333",
  },
  content: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#333",
  },
  label: {
    color: "#aaa",
    fontSize: 14,
  },
  value: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default GameLimits;
