// src/components/ProvablyFairModal.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const ProvablyFairModal: React.FC<Props> = ({ visible, onClose }) => {
  const [selectedOption, setSelectedOption] = useState<"random" | "manual">("manual");
  const [clientSeed, setClientSeed] = useState("JKHJ0DKmZ6LTRcqXE");

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>PROVABLY FAIR SETTINGS</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="x" size={20} color="#bbb" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.desc}>
              This game uses Provably Fair technology to determine game result.
              This tool gives you ability to change your seed and check fairness
              of the game.
            </Text>

            <Text style={styles.link}>❓ What is Provably Fair</Text>

            {/* Divider */}
            <View style={styles.divider} />

            {/* CLIENT SEED */}
            <View style={styles.sectionHeader}>
              <Icon name="monitor" size={16} color="#bbb" style={styles.icon} />
              <Text style={styles.sectionTitle}>Client (your) seed:</Text>
            </View>

            <Text style={styles.helper}>
              Round result is determined from combination of server seed and first
              3 bets of the round.
            </Text>

            {/* RANDOM ON EVERY NEW GAME */}
            <TouchableOpacity
              style={[
                styles.optionBox,
                selectedOption === "random" ? styles.optionActive : styles.optionDisabled,
              ]}
              onPress={() => setSelectedOption("random")}
            >
              <View style={styles.optionHeader}>
                <View
                  style={[
                    styles.radioOuter,
                    selectedOption === "random" && styles.radioOuterActive,
                  ]}
                >
                  {selectedOption === "random" && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.optionText}>Random on every new game</Text>
              </View>

              <View style={styles.seedBox}>
                <Text style={styles.seedLabel}>Current:</Text>
                <Text style={styles.seedValue}>JKHJ0DKmZ6LTRcqXE</Text>
                <Icon name="copy" size={14} color="#aaa" />
              </View>
            </TouchableOpacity>

            {/* ENTER MANUALLY */}
            <TouchableOpacity
              style={[
                styles.optionBox,
                selectedOption === "manual" ? styles.optionActive : styles.optionDisabled,
              ]}
              onPress={() => setSelectedOption("manual")}
            >
              <View style={styles.optionHeader}>
                <View
                  style={[
                    styles.radioOuter,
                    selectedOption === "manual" && styles.radioOuterActive,
                  ]}
                >
                  {selectedOption === "manual" && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.optionText}>Enter manually</Text>
              </View>

              <View style={styles.seedBox}>
                <Text style={styles.seedLabel}>Current:</Text>
                <TextInput
                  style={[
                    styles.input,
                    selectedOption !== "manual" && { color: "#666" },
                  ]}
                  editable={selectedOption === "manual"}
                  value={clientSeed}
                  onChangeText={setClientSeed}
                />
                <Icon name="copy" size={14} color="#aaa" />
              </View>

              <TouchableOpacity
                style={[
                  styles.changeBtn,
                  selectedOption === "manual"
                    ? styles.changeActive
                    : styles.changeDisabled,
                ]}
                disabled={selectedOption !== "manual"}
              >
                <Text
                  style={[
                    styles.changeText,
                    selectedOption !== "manual" && { color: "#777" },
                  ]}
                >
                  CHANGE
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
            <View style={styles.divider} />

            {/* SERVER SEED */}
            <View style={styles.sectionHeader}>
              <Icon name="server" size={16} color="#bbb" style={styles.icon} />
              <Text style={styles.sectionTitle}>Server seed SHA256:</Text>
            </View>

            <View style={styles.serverBox}>
              <Text style={styles.serverText}>
                7e74ccf9e7ce38b2b6f68332331eccf7
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "100%",
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#272727ff",
    height: 50,
    borderRadius: 10,

    paddingHorizontal: 15,
    alignItems: "center",
  },
  title: {
    color: "#a8a8a8ff",
    fontWeight: "bold",
    fontSize: 14,
  },
  desc: {
    color: "#aaa",
    fontSize: 12,
    paddingHorizontal: 15,

    lineHeight: 18,
    marginTop: 10,
  },
  link: {
    color: "#ff3355",
    fontSize: 12,
    marginTop: 5,
    paddingHorizontal: 15,

  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    marginVertical: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    paddingHorizontal: 15,

    alignItems: "center",
  },
  icon: {
    marginRight: 6,
    paddingHorizontal: 15,

  },
  sectionTitle: {
    color: "#fff",
    fontWeight: "bold",

    fontSize: 13,
  },
  helper: {
    color: "#999",
    paddingHorizontal: 15,

    fontSize: 11,
    marginBottom: 6,
    marginTop: 2,
  },
  optionBox: {
    borderRadius: 8,
    paddingHorizontal: 15,

    padding: 10,
    marginBottom: 10,
  },
  optionActive: {
    backgroundColor: "#2a2a2a",
    marginHorizontal: 15,

  },
  optionDisabled: {
    backgroundColor: "#181818",
  },
  optionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,

    marginBottom: 8,
  },
  radioOuter: {
    width: 14,
    height: 14,
    borderRadius: 7,

    borderWidth: 2,
    borderColor: "#555",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  radioOuterActive: {
    borderColor: "#00ff66",
  },
  radioDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#00ff66",
  },
  optionText: {
    color: "#fff",
    fontSize: 13,
  },
  seedBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f0f0f",

    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  seedLabel: {
    color: "#aaa",
    fontSize: 11,
    marginRight: 4,
  },
  seedValue: {
    flex: 1,
    color: "#fff",
    fontSize: 12,
    fontFamily: "monospace",
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 12,
    fontFamily: "monospace",
  },
  changeBtn: {
    marginTop: 8,
    borderRadius: 5,
    paddingVertical: 6,
    alignItems: "center",
  },
  changeActive: {
    backgroundColor: "#00ff66",
  },
  changeDisabled: {
    backgroundColor: "#333",
  },
  changeText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 12,
  },
  serverBox: {
    backgroundColor: "#0f0f0f",
    borderRadius: 6,
    padding: 8,
    marginVertical: 15,
    marginHorizontal: 15,
    marginTop: 6,
  },
  serverText: {
    color: "#fff",
    fontFamily: "monospace",
    
    fontSize: 12,
  },
});

export default ProvablyFairModal;
