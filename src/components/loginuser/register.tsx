import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface RegisterModalProps {
  visible: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({
  visible,
  onClose,
  onLogin,
}) => {
  const [tab, setTab] = useState<"social" | "fast">("fast");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [agree, setAgree] = useState(false);

  // Password strength checks
  const hasEight = password.length >= 8;
  const hasDigit = /\d/.test(password);
  const hasUpperLower = /[A-Z]/.test(password) && /[a-z]/.test(password);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Registration</Text>
              <TouchableOpacity onPress={onClose}>
                <Icon name="close" size={22} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleButton, tab === "social" && styles.activeTab]}
                onPress={() => setTab("social")}
              >
                <Text
                  style={[
                    styles.toggleText,
                    tab === "social" && styles.activeText,
                  ]}
                >
                  Social media
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, tab === "fast" && styles.activeTab]}
                onPress={() => setTab("fast")}
              >
                <Text
                  style={[
                    styles.toggleText,
                    tab === "fast" && styles.activeText,
                  ]}
                >
                  Fast
                </Text>
              </TouchableOpacity>
            </View>

            {/* Country / Currency */}
            <View style={styles.currencyContainer}>
              <Text style={styles.flag}>🇮🇳</Text>
              <Text style={styles.currencyText}>INR</Text>
              <Text style={styles.countryText}>Indian rupee</Text>
            </View>

            {/* Phone */}
            <View style={styles.inputContainer}>
              <Text style={styles.flag}>🇮🇳</Text>
              <TextInput
                style={styles.input}
                placeholder="+91 00000 00000"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                maxLength={10}
              />
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Icon name="email-outline" size={18} color="#666" />
              <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Icon name="lock-outline" size={18} color="#666" />
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={!showPass}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Icon
                  name={showPass ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            {/* Password Checks */}
            <View style={{ marginVertical: 6 }}>
              <PasswordCheck label="At least 8 characters" valid={hasEight} />
              <PasswordCheck label="Includes 1 digit" valid={hasDigit} />
              <PasswordCheck
                label="Includes uppercase and lowercase letters"
                valid={hasUpperLower}
              />
            </View>

            {/* Promo code */}
            <TouchableOpacity>
              <Text style={styles.promoText}>Add promo code</Text>
            </TouchableOpacity>

            {/* Agreement */}
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setAgree(!agree)}
              >
                <Icon
                  name={agree ? "checkbox-marked" : "checkbox-blank-outline"}
                  size={22}
                  color={agree ? "#007AFF" : "#999"}
                />
              </TouchableOpacity>
              <Text style={styles.agreeText}>
                By clicking "Register", I accept the{" "}
                <Text style={styles.link}>user agreement</Text>
              </Text>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.registerBtn, !agree && { opacity: 0.5 }]}
              disabled={!agree}
            >
              <Text style={styles.registerText}>Register</Text>
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <Text>Already have an account? </Text>
              <TouchableOpacity onPress={onLogin}>
                <Text style={styles.loginLink}>Log in</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const PasswordCheck = ({ label, valid }: { label: string; valid: boolean }) => (
  <View style={styles.passwordCheck}>
    <Icon
      name={valid ? "check-circle" : "checkbox-blank-circle-outline"}
      color={valid ? "#1EBD4D" : "#ccc"}
      size={16}
    />
    <Text style={[styles.checkText, valid && { color: "#1EBD4D" }]}>
      {label}
    </Text>
  </View>
);

export default RegisterModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 20, fontWeight: "600", color: "#000" },
  toggleContainer: {
    flexDirection: "row",
    marginVertical: 15,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#f2f2f2",
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  toggleText: { color: "#555", fontWeight: "500" },
  activeTab: { backgroundColor: "#007AFF" },
  activeText: { color: "#fff", fontWeight: "600" },
  currencyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  flag: { fontSize: 18, marginRight: 5 },
  currencyText: { fontWeight: "600", color: "#000", marginRight: 6 },
  countryText: { color: "#666" },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginVertical: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  input: { flex: 1, marginLeft: 8 },
  passwordCheck: { flexDirection: "row", alignItems: "center", marginVertical: 2 },
  checkText: { marginLeft: 6, fontSize: 13, color: "#555" },
  promoText: { color: "#007AFF", marginVertical: 8 },
  checkboxContainer: { flexDirection: "row", alignItems: "center", marginVertical: 8 },
  checkbox: { marginRight: 6 },
  agreeText: { flex: 1, color: "#555", fontSize: 13 },
  link: { color: "#007AFF", textDecorationLine: "underline" },
  registerBtn: {
    backgroundColor: "#1EBD4D",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },
  registerText: { color: "#fff", fontWeight: "600" },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 15 },
  loginLink: { color: "#007AFF", fontWeight: "600" },
});
