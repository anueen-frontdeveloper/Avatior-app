import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
  onRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ visible, onClose, onRegister }) => {
  const [loginType, setLoginType] = useState<"phone" | "email">("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const renderInput = () => {
    if (loginType === "phone") {
      return (
        <View>
          <View style={[styles.inputContainer, phone.length !== 10 && phone.length > 0 && styles.errorBorder]}>
            <Text style={styles.countryCode}>🇮🇳</Text>
            <TextInput
              style={styles.input}
              placeholder="+91 00000 00000"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              maxLength={10}
            />
          </View>
          {phone.length > 0 && phone.length !== 10 && (
            <Text style={styles.errorText}>Make sure your phone number is correct</Text>
          )}
        </View>
      );
    }

    return (
      <TextInput
        style={styles.inputContainer}
        placeholder="Enter your email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <View style={styles.header}>
            <Text style={styles.title}>Login</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={22} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Toggle Tabs */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, loginType === "phone" && styles.activeTab]}
              onPress={() => setLoginType("phone")}
            >
              <Text style={[styles.toggleText, loginType === "phone" && styles.activeText]}>
                Phone
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, loginType === "email" && styles.activeTab]}
              onPress={() => setLoginType("email")}
            >
              <Text style={[styles.toggleText, loginType === "email" && styles.activeText]}>
                Email
              </Text>
            </TouchableOpacity>
          </View>

          {renderInput()}

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.inputContainer}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity>
              <Text style={styles.forgotText}>Forgot your password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginBtn}>
            <Text style={styles.loginText}>Log in</Text>
          </TouchableOpacity>

          {/* Social Login */}
          <View style={styles.socialContainer}>
            {["google", "vk", "yandex", "odnoklassniki", "steam"].map((icon, i) => (
              <Image
                key={i}
                source={{
                  uri: `https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/${icon}.svg`,
                }}
                style={styles.socialIcon}
              />
            ))}
          </View>

          {/* Register */}
          <View style={styles.footer}>
            <Text>Don’t have an account? </Text>
            <TouchableOpacity onPress={onRegister}>
              <Text style={styles.registerText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LoginModal;

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
    elevation: 5,
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
    padding: 10,
    alignItems: "center",
  },
  toggleText: { color: "#555" },
  activeTab: {
    backgroundColor: "#007AFF",
  },
  activeText: { color: "#fff", fontWeight: "600" },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  input: { flex: 1, marginLeft: 10 },
  errorBorder: { borderColor: "red" },
  errorText: { color: "red", fontSize: 12, marginLeft: 5 },
  passwordContainer: { marginTop: 10 },
  forgotText: { color: "#007AFF", textAlign: "right", marginTop: 5 },
  loginBtn: {
    backgroundColor: "#1EBD4D",
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
  },
  loginText: { color: "#fff", fontWeight: "600" },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  socialIcon: { width: 32, height: 32 },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 15 },
  registerText: { color: "#007AFF", fontWeight: "600" },
  countryCode: { fontSize: 18, marginRight: 5 },
});
