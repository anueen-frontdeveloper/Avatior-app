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

interface Props {
  visible: boolean;
  onClose: () => void;
}

const ProvablyFairModal: React.FC<Props> = ({ visible, onClose }) => {
  const [clientSeed, setClientSeed] = useState("EtwfqfasCdX2VuWjkn");

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>PROVABLY FAIR SETTINGS</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>X</Text>
            </TouchableOpacity>
          </View>

          <ScrollView>
            <Text style={styles.desc}>
              This game uses Provably Fair technology to determine game result.
              This tool gives you ability to change your seed and check fairness
              of the game.
            </Text>

            {/* Client Seed */}
            <Text style={styles.sectionTitle}>Client (your) seed:</Text>
            <TouchableOpacity style={styles.option}>
              <Text style={styles.optionText}>🔄 Random on every new game</Text>
            </TouchableOpacity>

            <Text style={styles.optionText}>OR</Text>

            <View style={styles.manualBox}>
              <Text style={styles.optionText}>✍ Enter manually</Text>
              <TextInput
                style={styles.input}
                value={clientSeed}
                onChangeText={setClientSeed}
              />
              <TouchableOpacity style={styles.changeBtn}>
                <Text style={styles.changeText}>CHANGE</Text>
              </TouchableOpacity>
            </View>

            {/* Server Seed */}
            <Text style={styles.sectionTitle}>Server seed SHA256:</Text>
            <View style={styles.seedBox}>
              <Text style={styles.seedText}>
                e397eabe93d44e66c7a9cf0a1c4eaa6
              </Text>
            </View>

            <Text style={styles.footer}>
              You can check fairness of each bet from bets history
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 2,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "90%",
    backgroundColor: "#242424ff",
    borderRadius: 10,
    padding: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  close: {
    color: "red",
    fontSize: 18,
    fontWeight: "bold",
  },
  desc: {
    color: "#ccc",
    fontSize: 13,
    marginBottom: 10,
  },
  sectionTitle: {
    color: "#fff",
    fontWeight: "bold",
    marginTop: 10,
  },
  option: {
    padding: 8,
    backgroundColor: "#333",
    borderRadius: 5,
    marginTop: 5,
  },
  optionText: {
    color: "#fff",
  },
  manualBox: {
    marginTop: 10,
  },
  input: {
    backgroundColor: "#222",
    color: "#fff",
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 5,
    padding: 5,
    marginTop: 5,
  },
  changeBtn: {
    marginTop: 8,
    backgroundColor: "#0f0",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  changeText: {
    color: "#000",
    fontWeight: "bold",
  },
  seedBox: {
    backgroundColor: "#333",
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
  },
  seedText: {
    color: "#fff",
    fontSize: 12,
  },
  footer: {
    color: "#999",
    fontSize: 12,
    marginTop: 10,
  },
});

export default ProvablyFairModal;
