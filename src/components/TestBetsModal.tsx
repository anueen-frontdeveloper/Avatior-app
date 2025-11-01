import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
};

const TestBetsModal: React.FC<Props> = ({ visible, onClose }) => {
  const [isCashMode, setIsCashMode] = useState(true);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>FREE BETS MANAGEMENT</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Mode Selector */}
          <TouchableOpacity
            style={[styles.modeButton, isCashMode && styles.modeButtonActive]}
            onPress={() => setIsCashMode(true)}
          >
            <Text
              style={[
                styles.modeText,
                isCashMode && styles.modeTextActive,
              ]}
            >
              Play with cash
            </Text>
          </TouchableOpacity>

          {/* Section: Active Free Bets */}
          <Text style={styles.sectionTitle}>ACTIVE FREE BETS</Text>

          {/* No Active Bets Section */}
          <View style={styles.noBetsContainer}>
            <Image
              source={require("../../assets/ticket.png")}
              style={styles.ticketIcon}
              resizeMode="contain"
            />
            <Text style={styles.noBetsText}>No Active Free Bets. Yet!</Text>
          </View>

        </View>
      </View>
    </Modal>
  );
};

export default TestBetsModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1, 
    marginTop: 60,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  container: {
    backgroundColor: "#1a1a1a",
    width: "85%",
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopEndRadius: 8,
    borderTopStartRadius: 8,
    height: 30,
    marginBottom: 14,
    backgroundColor: "#333",

  },
  headerTitle: {
    color: "#ddd",
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 0.5,
    marginHorizontal: 16,

  },
  closeIcon: {
    color: "#aaa",
    marginHorizontal: 16,

    fontSize: 18,
  },
  modeButton: {
    borderColor: "#444",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    marginHorizontal: 16,

    paddingHorizontal: 74,
    marginBottom: 14,
  },
  modeButtonActive: {
    borderColor: "#00ff75",

  },
  modeText: {
    color: "#888",

    fontSize: 13,
  },
  modeTextActive: {
    color: "#00ff75",
  },
  sectionTitle: {
    color: "#aaa",
    marginHorizontal: 16,

    fontSize: 12,
    marginBottom: 8,
  },
  noBetsContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  ticketIcon: {
    width: 150,
    height: 150,
    tintColor: "#a5a5a5ff",
  },
  noBetsText: {
    color: "#a5a5a5ff",
    fontSize: 13,
    marginBottom: 16,

  },
  archiveBtn: {
    alignSelf: "flex-end",
    marginTop: 10,
  },
  archiveText: {
    color: "#777",
    fontSize: 12,
  },
});
